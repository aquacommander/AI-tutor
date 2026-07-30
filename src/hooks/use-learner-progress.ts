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
import { levelFromXp } from '@/lib/constants';
import type { ActivityEntry, AgeGroupId, StoredLearnerState } from '@/types/learner';

const MAX_ACTIVITY_ENTRIES = 4;

export interface UseLearnerProgress {
  learner: StoredLearnerState | null;
  /**
   * False during SSR and the first client render. Guard personalised UI on this
   * so the server and client markup match and nothing flashes.
   */
  isLoaded: boolean;
  setAgeGroup: (ageGroup: AgeGroupId) => void;
  awardXp: (amount: number, activity: Omit<ActivityEntry, 'xpEarned' | 'occurredAt'>) => void;
  /**
   * Records a Code Lab challenge and pays out its XP in a single write.
   * Returns false if it was already complete, so re-checking a solved
   * challenge cannot be farmed for XP.
   */
  completeChallenge: (
    challengeId: string,
    xp: number,
    activity: Omit<ActivityEntry, 'xpEarned' | 'occurredAt'>,
  ) => boolean;
  reset: () => void;
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
      writeLearnerState(createInitialLearnerState(ageGroup));
      return;
    }

    // Switching groups keeps earned XP but re-bases the level floor.
    const { level, nextLevelXp } = levelFromXp(current.progress.currentXp, ageGroup);
    writeLearnerState({
      ...current,
      ageGroup,
      progress: { ...current.progress, ageGroup, level, nextLevelXp },
      lastActivityAt: new Date().toISOString(),
    });
  }, []);

  const awardXp = useCallback<UseLearnerProgress['awardXp']>((amount, activity) => {
    const current = getLearnerSnapshot();
    if (!current || amount <= 0) return;

    const currentXp = current.progress.currentXp + amount;
    const { level, nextLevelXp } = levelFromXp(currentXp, current.ageGroup);
    const occurredAt = new Date().toISOString();

    writeLearnerState({
      ...current,
      progress: { ...current.progress, currentXp, level, nextLevelXp },
      recentActivity: [{ ...activity, xpEarned: amount, occurredAt }, ...current.recentActivity].slice(
        0,
        MAX_ACTIVITY_ENTRIES,
      ),
      lastActivityAt: occurredAt,
    });
  }, []);

  const completeChallenge = useCallback<UseLearnerProgress['completeChallenge']>(
    (challengeId, xp, activity) => {
      const current = getLearnerSnapshot();
      if (!current || current.completedChallenges.includes(challengeId)) return false;

      // One write rather than "mark complete, then award XP": two writes would
      // notify subscribers twice and briefly render a solved challenge worth
      // nothing.
      const currentXp = current.progress.currentXp + Math.max(0, xp);
      const { level, nextLevelXp } = levelFromXp(currentXp, current.ageGroup);
      const occurredAt = new Date().toISOString();

      writeLearnerState({
        ...current,
        completedChallenges: [...current.completedChallenges, challengeId],
        progress: { ...current.progress, currentXp, level, nextLevelXp },
        recentActivity: [
          { ...activity, xpEarned: xp, occurredAt },
          ...current.recentActivity,
        ].slice(0, MAX_ACTIVITY_ENTRIES),
        lastActivityAt: occurredAt,
      });

      return true;
    },
    [],
  );

  const reset = useCallback(() => clearLearnerState(), []);

  return { learner, isLoaded, setAgeGroup, awardXp, completeChallenge, reset };
}
