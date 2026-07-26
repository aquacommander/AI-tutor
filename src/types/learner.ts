import type { ImageKey } from '@/lib/images';

export type AgeGroupId = 'explorer' | 'builder' | 'creator';

export type ThemeName = 'green' | 'purple' | 'coral' | 'blue' | 'orange';

export interface NextReward {
  name: string;
  /** Completion of the reward, 0-100. */
  progress: number;
  image: ImageKey;
}

export interface LearnerProgress {
  displayName: string;
  ageGroup: AgeGroupId;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  badgeCount: number;
  streakDays: number;
  nextReward: NextReward;
}

export interface ActivityEntry {
  id: string;
  label: string;
  detail: string;
  xpEarned: number;
  /** ISO-8601 timestamp. */
  occurredAt: string;
}

/**
 * The complete guest-mode learner record held in localStorage.
 *
 * `version` is checked on read: an unrecognised version is discarded rather
 * than migrated, so a shape change can never crash the app for a returning
 * learner. Everything here moves to Supabase in v1.1.
 */
export interface StoredLearnerState {
  version: 1;
  ageGroup: AgeGroupId;
  progress: LearnerProgress;
  completedLessons: string[];
  completedChallenges: string[];
  earnedBadges: string[];
  recentActivity: ActivityEntry[];
  lastActivityAt: string;
}
