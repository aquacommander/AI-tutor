'use client';

import { useCallback, useSyncExternalStore } from 'react';
import {
  clearLearnerState,
  createInitialLearnerState,
  getLearnerServerSnapshot,
  getLearnerSnapshot,
  subscribeToLearner,
  writeLearnerState,
} from '@/lib/storage';
import { findCourse } from '@/data/courses';
import { levelFromXp } from '@/lib/constants';
import type { ActivityEntry, AgeGroupId, StoredLearnerState } from '@/types/learner';

const MAX_ACTIVITY_ENTRIES = 4;

type NewActivity = Omit<ActivityEntry, 'xpEarned' | 'occurredAt'>;

/** What finishing a lesson paid out, so the page can celebrate it. */
export interface LessonReward {
  xp: number;
  /** Lesson badge, plus the course badge when this was the final lesson. */
  badgeIds: string[];
  courseCompleted: boolean;
}

export interface UseLearnerProgress {
  learner: StoredLearnerState | null;
  /**
   * False during SSR and the first client render. Guard personalised UI on this
   * so the server and client markup match and nothing flashes.
   */
  isLoaded: boolean;
  setAgeGroup: (ageGroup: AgeGroupId) => void;
  awardXp: (amount: number, activity: NewActivity, badgeIds?: string[]) => void;
  /**
   * Records a Code Lab challenge and pays out its XP in a single write.
   * Returns false if it was already complete, so re-checking a solved
   * challenge cannot be farmed for XP.
   */
  completeChallenge: (challengeId: string, xp: number, activity: NewActivity) => boolean;
  /**
   * Records a lesson, its XP, and its badge — plus the course badge and bonus
   * if it was the last one. Returns null if the lesson was already complete.
   */
  completeLesson: (courseId: string, lessonId: string) => LessonReward | null;
  /** Idempotent. Safe to call on every visit to a page that earns a badge. */
  earnBadge: (badgeId: string) => void;
  reset: () => void;
}

interface Reward {
  xp?: number;
  activity?: NewActivity;
  badgeIds?: string[];
  patch?: Partial<StoredLearnerState>;
}

/**
 * Every mutation goes through here, so XP, badges, activity and the level
 * recalculation always land in **one** write. Two writes would notify
 * subscribers twice and let the UI render a half-applied reward — a lesson
 * marked complete but momentarily worth no XP.
 */
function applyReward(reward: Reward): StoredLearnerState | null {
  const current = getLearnerSnapshot();
  if (!current) return null;

  const xp = Math.max(0, reward.xp ?? 0);
  const currentXp = current.progress.currentXp + xp;
  const { level, nextLevelXp } = levelFromXp(currentXp, current.ageGroup);
  const occurredAt = new Date().toISOString();

  const earnedBadges = reward.badgeIds?.length
    ? Array.from(new Set([...current.earnedBadges, ...reward.badgeIds]))
    : current.earnedBadges;

  const recentActivity = reward.activity
    ? [{ ...reward.activity, xpEarned: xp, occurredAt }, ...current.recentActivity].slice(
        0,
        MAX_ACTIVITY_ENTRIES,
      )
    : current.recentActivity;

  const next: StoredLearnerState = {
    ...current,
    ...reward.patch,
    earnedBadges,
    recentActivity,
    progress: {
      ...current.progress,
      currentXp,
      level,
      nextLevelXp,
      badgeCount: earnedBadges.length,
    },
    lastActivityAt: occurredAt,
  };

  writeLearnerState(next);
  return next;
}

export function useLearnerProgress(): UseLearnerProgress {
  const learner = useSyncExternalStore(
    subscribeToLearner,
    getLearnerSnapshot,
    getLearnerServerSnapshot,
  );

  // `isLoaded` cannot simply be `learner !== null` — a genuine first-time
  // visitor is also null. Subscribing to the store and reading a second
  // snapshot lets us distinguish "not hydrated yet" from "no profile".
  const isLoaded = useSyncExternalStore(
    subscribeToLearner,
    () => true,
    () => false,
  );

  const setAgeGroup = useCallback((ageGroup: AgeGroupId) => {
    const current = getLearnerSnapshot();

    if (!current) {
      writeLearnerState({
        ...createInitialLearnerState(ageGroup),
        earnedBadges: ['first-steps'],
        progress: { ...createInitialLearnerState(ageGroup).progress, badgeCount: 1 },
      });
      return;
    }

    // Switching groups keeps earned XP but re-bases the level floor.
    const { level, nextLevelXp } = levelFromXp(current.progress.currentXp, ageGroup);
    writeLearnerState({
      ...current,
      ageGroup,
      earnedBadges: Array.from(new Set([...current.earnedBadges, 'first-steps'])),
      progress: { ...current.progress, ageGroup, level, nextLevelXp },
      lastActivityAt: new Date().toISOString(),
    });
  }, []);

  const awardXp = useCallback<UseLearnerProgress['awardXp']>((amount, activity, badgeIds) => {
    if (amount <= 0 && !badgeIds?.length) return;
    applyReward({ xp: amount, activity, badgeIds });
  }, []);

  const earnBadge = useCallback<UseLearnerProgress['earnBadge']>((badgeId) => {
    const current = getLearnerSnapshot();
    if (!current || current.earnedBadges.includes(badgeId)) return;
    applyReward({ badgeIds: [badgeId] });
  }, []);

  const completeChallenge = useCallback<UseLearnerProgress['completeChallenge']>(
    (challengeId, xp, activity) => {
      const current = getLearnerSnapshot();
      if (!current || current.completedChallenges.includes(challengeId)) return false;

      applyReward({
        xp,
        activity,
        badgeIds: ['code-starter'],
        patch: { completedChallenges: [...current.completedChallenges, challengeId] },
      });
      return true;
    },
    [],
  );

  const completeLesson = useCallback<UseLearnerProgress['completeLesson']>((courseId, lessonId) => {
    const current = getLearnerSnapshot();
    const course = findCourse(courseId);
    const lesson = course?.lessons.find((entry) => entry.id === lessonId);
    if (!current || !course || !lesson) return null;

    const key = `${courseId}/${lessonId}`;
    if (current.completedLessons.includes(key)) return null;

    const completedLessons = [...current.completedLessons, key];
    const courseCompleted = course.lessons.every((entry) =>
      completedLessons.includes(`${courseId}/${entry.id}`),
    );

    const badgeIds = [lesson.badgeId];
    if (courseCompleted) badgeIds.push(course.badgeId, 'course-finisher');

    const xp = lesson.xpReward + (courseCompleted ? course.completionXp : 0);

    applyReward({
      xp,
      badgeIds,
      patch: { completedLessons },
      activity: {
        id: `lesson-${courseId}-${lessonId}`,
        label: `Finished ${lesson.title}`,
        detail: course.title,
      },
    });

    return { xp, badgeIds, courseCompleted };
  }, []);

  const reset = useCallback(() => clearLearnerState(), []);

  return {
    learner,
    isLoaded,
    setAgeGroup,
    awardXp,
    completeChallenge,
    completeLesson,
    earnBadge,
    reset,
  };
}
