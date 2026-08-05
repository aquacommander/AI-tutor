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
import { courses, findCourse } from '@/data/courses';
import { levelFromXp } from '@/lib/constants';
import type {
  ActivityEntry,
  ActivityResult,
  AgeGroupId,
  StoredLearnerState,
} from '@/types/learner';

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
  /**
   * Records a capstone. The plan is explicit that the course badge is earned
   * here, not by watching videos: "Award the course badge only after the
   * capstone, not after passive video viewing."
   */
  completeCapstone: (courseId: string) => LessonReward | null;
  /** Stores a guided-activity record: answers, clues, attempts and score. */
  recordActivity: (result: ActivityResult) => void;
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
/** Calendar days between two ISO timestamps, ignoring the time of day. */
function daysBetween(from: string, to: Date): number {
  const a = new Date(from);
  const start = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
  const end = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate());
  return Math.round((end - start) / 86_400_000);
}

/**
 * The streak, counted in calendar days rather than hours.
 *
 * Learning at 9pm and again at 9am the next morning is two days in a row, which
 * is how a child would count it. Anything longer than a day's gap starts again
 * at one — a streak that survives a fortnight away is not a streak.
 */
function nextStreak(current: StoredLearnerState, now: Date): number {
  const gap = daysBetween(current.lastActivityAt, now);
  if (gap === 0) return Math.max(1, current.progress.streakDays);
  if (gap === 1) return current.progress.streakDays + 1;
  return 1;
}

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

  const streakDays = nextStreak(current, new Date(occurredAt));
  // Five days running earns its badge here rather than anywhere else, so it
  // cannot be missed by a caller that forgot to check.
  const withStreak =
    streakDays >= 5 && !earnedBadges.includes('streak-keeper')
      ? [...earnedBadges, 'streak-keeper']
      : earnedBadges;

  const next: StoredLearnerState = {
    ...current,
    ...reward.patch,
    earnedBadges: withStreak,
    recentActivity,
    progress: {
      ...current.progress,
      currentXp,
      level,
      nextLevelXp,
      streakDays,
      badgeCount: withStreak.length,
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

  const recordActivity = useCallback<UseLearnerProgress['recordActivity']>((result) => {
    const current = getLearnerSnapshot();
    if (!current) return;
    applyReward({
      patch: { activityResults: { ...current.activityResults, [result.key]: result } },
    });
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

    // The course badge is deliberately *not* awarded here — that waits for the
    // capstone.
    applyReward({
      xp: lesson.xpReward,
      badgeIds: [lesson.badgeId],
      patch: { completedLessons },
      activity: {
        id: `lesson-${courseId}-${lessonId}`,
        label: `Finished ${lesson.title}`,
        detail: course.title,
      },
    });

    return { xp: lesson.xpReward, badgeIds: [lesson.badgeId], courseCompleted };
  }, []);

  const completeCapstone = useCallback<UseLearnerProgress['completeCapstone']>((courseId) => {
    const current = getLearnerSnapshot();
    const course = findCourse(courseId);
    if (!current || !course) return null;

    const key = `capstone:${courseId}`;
    if (current.completedLessons.includes(key)) return null;

    const completedLessons = [...current.completedLessons, key];
    const badgeIds = [course.capstone.badgeId];

    // The graduate badge lands once every capstone is in.
    const allDone = courses.every((entry) =>
      completedLessons.includes(`capstone:${entry.id}`),
    );
    if (allDone) badgeIds.push('graduate');

    applyReward({
      xp: course.capstone.xpReward,
      badgeIds,
      patch: { completedLessons },
      activity: {
        id: `capstone-${courseId}`,
        label: `Completed ${course.capstone.title}`,
        detail: course.title,
      },
    });

    return { xp: course.capstone.xpReward, badgeIds, courseCompleted: true };
  }, []);

  const reset = useCallback(() => clearLearnerState(), []);

  return {
    learner,
    isLoaded,
    setAgeGroup,
    awardXp,
    completeChallenge,
    completeLesson,
    completeCapstone,
    recordActivity,
    earnBadge,
    reset,
  };
}
