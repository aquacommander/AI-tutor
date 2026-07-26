import { Blocks, Lightbulb, Telescope } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import type { AgeGroupCardData } from '@/types/homepage';

export const ageGroups: AgeGroupCardData[] = [
  {
    id: 'explorer',
    title: 'Explorer',
    ageRange: '6-8',
    description: 'Discover the magic of AI through stories, games, and playful activities.',
    focus: ['AI concepts', 'Sorting and logic', 'Visual puzzles'],
    icon: Telescope,
    characterImage: 'age-groups/explorer.webp',
    theme: 'green',
    href: `${ROUTES.ageSelect}?group=explorer`,
  },
  {
    id: 'builder',
    title: 'Builder',
    ageRange: '9-12',
    description: 'Build, code, and explore real-world AI projects step by step.',
    focus: ['Python basics', 'Data science', 'AI ethics'],
    icon: Blocks,
    characterImage: 'age-groups/builder.webp',
    theme: 'purple',
    href: `${ROUTES.ageSelect}?group=builder`,
  },
  {
    id: 'creator',
    title: 'Creator',
    ageRange: '13-16',
    description: 'Design, code, and create AI solutions that turn ideas into impact.',
    focus: ['Advanced Python', 'Computer vision & NLP', 'Game dev & robotics'],
    icon: Lightbulb,
    characterImage: 'age-groups/creator.webp',
    theme: 'coral',
    href: `${ROUTES.ageSelect}?group=creator`,
  },
];
