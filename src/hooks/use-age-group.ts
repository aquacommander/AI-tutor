'use client';

import { useLearnerProgress } from './use-learner-progress';
import type { AgeGroupId } from '@/types/learner';

export interface UseAgeGroup {
  ageGroup: AgeGroupId | null;
  isLoaded: boolean;
  setAgeGroup: (ageGroup: AgeGroupId) => void;
}

/** Narrow view of the learner store for components that only care about the tier. */
export function useAgeGroup(): UseAgeGroup {
  const { learner, isLoaded, setAgeGroup } = useLearnerProgress();
  return { ageGroup: learner?.ageGroup ?? null, isLoaded, setAgeGroup };
}
