import { ROUTES } from '@/lib/constants';
import type { AgeGroupId } from '@/types/learner';

export interface DailyChallenge {
  title: string;
  description: string;
  xpReward: number;
  href: string;
  ctaLabel: string;
}

/** One challenge per tier, surfaced on the dashboard (PRD section 4.2). */
export const dailyChallenges: Record<AgeGroupId, DailyChallenge> = {
  explorer: {
    title: 'Sort the Robots',
    description: 'Help Sparky put pictures into the right groups — just like an AI does.',
    xpReward: 50,
    href: ROUTES.code,
    ctaLabel: 'Start the challenge',
  },
  builder: {
    title: 'Guess My Number',
    description: 'Write a Python program that plays a guessing game with your friend.',
    xpReward: 100,
    href: ROUTES.code,
    ctaLabel: 'Open Code Lab',
  },
  creator: {
    title: 'Build a Prime Checker',
    description: 'Write a function that decides whether a number is prime, then explain how it works.',
    xpReward: 150,
    href: ROUTES.code,
    ctaLabel: 'Open Code Lab',
  },
};
