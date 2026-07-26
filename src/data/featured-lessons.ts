import { ROUTES } from '@/lib/constants';
import type { FeaturedLesson } from '@/types/course';

/**
 * Homepage marketing previews. The authoritative course catalogue lands in
 * Milestone 3 (`src/lib/courses.ts`); these four link into it once it exists.
 */
export const featuredLessons: FeaturedLesson[] = [
  {
    id: 'meet-sparky',
    title: 'Meet Sparky',
    description: 'Discover how AI helps us every day.',
    durationMinutes: 15,
    difficulty: 'beginner',
    image: 'lessons/meet-sparky.webp',
    href: ROUTES.tutor,
    accent: 'green',
  },
  {
    id: 'train-your-ai',
    title: 'Train Your AI',
    description: 'Teach a computer to recognise images.',
    durationMinutes: 20,
    difficulty: 'beginner',
    image: 'lessons/train-your-ai.webp',
    href: ROUTES.courses,
    accent: 'blue',
  },
  {
    id: 'ai-art-studio',
    title: 'AI Art Studio',
    description: 'Create amazing art using AI tools.',
    durationMinutes: 25,
    difficulty: 'intermediate',
    image: 'lessons/ai-art-studio.webp',
    href: ROUTES.create,
    accent: 'purple',
  },
  {
    id: 'smart-city',
    title: 'Build a Smart City',
    description: 'Design AI solutions for real-world problems.',
    durationMinutes: 30,
    difficulty: 'advanced',
    image: 'lessons/smart-city.webp',
    href: ROUTES.courses,
    accent: 'orange',
  },
];
