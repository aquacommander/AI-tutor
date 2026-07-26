import { AGE_GROUP_LABEL, LEARNER_STORAGE_KEY, isAgeGroupId, levelFromXp } from './constants';
import type { AgeGroupId, StoredLearnerState } from '@/types/learner';

/**
 * `useSyncExternalStore` calls `getSnapshot` on every render and bails out only
 * if the returned reference is identical. Parsing JSON fresh each time would
 * hand back a new object and spin forever, so the parsed value is memoised
 * against the raw string it came from.
 */
let cachedRaw: string | null = null;
let cachedState: StoredLearnerState | null = null;

const listeners = new Set<() => void>();

function isBrowser() {
  return typeof window !== 'undefined';
}

/** Validate the shape rather than trusting whatever is in localStorage. */
function parseLearnerState(raw: string | null): StoredLearnerState | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;

    const candidate = parsed as Partial<StoredLearnerState>;
    if (candidate.version !== 1) return null;
    if (!isAgeGroupId(candidate.ageGroup)) return null;
    if (typeof candidate.progress !== 'object' || candidate.progress === null) return null;

    return {
      version: 1,
      ageGroup: candidate.ageGroup,
      progress: candidate.progress,
      completedLessons: Array.isArray(candidate.completedLessons) ? candidate.completedLessons : [],
      completedChallenges: Array.isArray(candidate.completedChallenges)
        ? candidate.completedChallenges
        : [],
      earnedBadges: Array.isArray(candidate.earnedBadges) ? candidate.earnedBadges : [],
      recentActivity: Array.isArray(candidate.recentActivity) ? candidate.recentActivity : [],
      lastActivityAt: candidate.lastActivityAt ?? new Date().toISOString(),
    };
  } catch {
    // Corrupt or hand-edited value: treat the learner as brand new.
    return null;
  }
}

export function createInitialLearnerState(ageGroup: AgeGroupId): StoredLearnerState {
  const { level, nextLevelXp } = levelFromXp(0, ageGroup);

  return {
    version: 1,
    ageGroup,
    progress: {
      displayName: `${AGE_GROUP_LABEL[ageGroup]} learner`,
      ageGroup,
      level,
      currentXp: 0,
      nextLevelXp,
      badgeCount: 0,
      streakDays: 0,
      nextReward: {
        name: 'First Steps Badge',
        progress: 0,
        image: 'rewards/gift.webp',
      },
    },
    completedLessons: [],
    completedChallenges: [],
    earnedBadges: [],
    recentActivity: [],
    lastActivityAt: new Date().toISOString(),
  };
}

export function getLearnerSnapshot(): StoredLearnerState | null {
  if (!isBrowser()) return null;

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(LEARNER_STORAGE_KEY);
  } catch {
    // Private browsing or a blocked storage partition. Behave like a new guest.
    return null;
  }

  if (raw === cachedRaw) return cachedState;
  cachedRaw = raw;
  cachedState = parseLearnerState(raw);
  return cachedState;
}

/** Server render and the first client render must agree: nobody is logged in yet. */
export function getLearnerServerSnapshot(): StoredLearnerState | null {
  return null;
}

function notify() {
  for (const listener of listeners) listener();
}

export function subscribeToLearner(onChange: () => void) {
  listeners.add(onChange);

  // The listener set covers this tab; `storage` fires only in *other* tabs.
  const handleCrossTab = (event: StorageEvent) => {
    if (event.key === null || event.key === LEARNER_STORAGE_KEY) onChange();
  };

  if (isBrowser()) window.addEventListener('storage', handleCrossTab);

  return () => {
    listeners.delete(onChange);
    if (isBrowser()) window.removeEventListener('storage', handleCrossTab);
  };
}

export function writeLearnerState(state: StoredLearnerState) {
  if (!isBrowser()) return;

  const serialised = JSON.stringify(state);
  try {
    window.localStorage.setItem(LEARNER_STORAGE_KEY, serialised);
  } catch {
    // Quota exceeded or storage disabled. The write below still keeps this
    // session coherent; only persistence across reloads is lost.
  }

  cachedRaw = serialised;
  cachedState = state;
  notify();
}

export function clearLearnerState() {
  if (!isBrowser()) return;

  try {
    window.localStorage.removeItem(LEARNER_STORAGE_KEY);
  } catch {
    // Nothing to clean up if storage was never writable.
  }

  cachedRaw = null;
  cachedState = null;
  notify();
}
