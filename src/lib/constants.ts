import type { AgeGroupId } from '@/types/learner';

export const SITE = {
  name: 'AI for Kids',
  tagline: 'Learn AI Through Play, Creativity, and Discovery',
  description:
    'A playful and safe learning platform where children explore AI, coding, creativity, and technology.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const;

export const LEARNER_STORAGE_KEY = 'ai-for-kids:learner:v1';

export const ROUTES = {
  home: '/',
  ageSelect: '/age-select',
  login: '/login',
  dashboard: '/dashboard',
  tutor: '/tutor',
  code: '/code',
  create: '/create',
  courses: '/courses',
  stories: '/stories',
  certificate: '/certificate',
  parents: '/for-parents',
  about: '/about',
  privacy: '/privacy',
} as const;

export interface NavChild {
  label: string;
  href: string;
  description: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', href: ROUTES.home },
  {
    label: 'Learn',
    href: ROUTES.tutor,
    children: [
      {
        label: 'Sparky AI Tutor',
        href: ROUTES.tutor,
        description: 'Ask questions, get friendly answers.',
      },
      { label: 'Code Lab', href: ROUTES.code, description: 'Write Python and solve challenges.' },
      {
        label: 'Creative Studio',
        href: ROUTES.create,
        description: 'Make stories, art prompts, and music.',
      },
      {
        label: 'Story Shelf',
        href: ROUTES.stories,
        description: 'Fairy tales with an AI idea hidden inside.',
      },
    ],
  },
  { label: 'Courses', href: ROUTES.courses },
  { label: 'Stories', href: ROUTES.stories },
  { label: 'For Parents', href: ROUTES.parents },
  { label: 'About Us', href: ROUTES.about },
];

/** XP required to advance one level. */
export const LEVEL_STEP_XP = 600;

/**
 * Each age group starts at a different level so older learners are not shown a
 * "Level 1" badge for material well below their reading age.
 */
export const AGE_GROUP_START_LEVEL: Record<AgeGroupId, number> = {
  explorer: 1,
  builder: 3,
  creator: 5,
};

export const AGE_GROUP_LABEL: Record<AgeGroupId, string> = {
  explorer: 'Explorer',
  builder: 'Builder',
  creator: 'Creator',
};

export const AGE_GROUP_RANGE: Record<AgeGroupId, string> = {
  explorer: '6-8',
  builder: '9-12',
  creator: '13-16',
};

export function isAgeGroupId(value: unknown): value is AgeGroupId {
  return value === 'explorer' || value === 'builder' || value === 'creator';
}

/** Level and next-level threshold derived from raw XP. */
export function levelFromXp(xp: number, ageGroup: AgeGroupId) {
  const completedLevels = Math.floor(Math.max(0, xp) / LEVEL_STEP_XP);
  return {
    level: AGE_GROUP_START_LEVEL[ageGroup] + completedLevels,
    nextLevelXp: (completedLevels + 1) * LEVEL_STEP_XP,
  };
}
