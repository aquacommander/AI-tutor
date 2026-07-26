import type { CourseSummary } from '@/types/course';

/**
 * Catalogue metadata for the four launch tracks. Lesson bodies and quiz banks
 * are authored in Milestone 3; these summaries drive the dashboard strip and
 * the course library cards until then.
 */
export const courseSummaries: CourseSummary[] = [
  {
    id: 'ai-ethics',
    title: 'AI Ethics & Society',
    description: 'How AI makes decisions, where it gets things wrong, and why fairness matters.',
    lessonCount: 5,
    totalXp: 300,
    difficulty: 'beginner',
    topics: ['Ethics', 'Society'],
    image: 'courses/ai-ethics.webp',
    accent: 'purple',
  },
  {
    id: 'data-science',
    title: 'Data Science for Kids',
    description: 'Collect data, spot patterns, and turn numbers into pictures that tell a story.',
    lessonCount: 5,
    totalXp: 350,
    difficulty: 'beginner',
    topics: ['Data', 'Python'],
    image: 'courses/data-science.webp',
    accent: 'blue',
  },
  {
    id: 'vision-nlp',
    title: 'Computer Vision & NLP',
    description: 'Teach a computer to see pictures and understand the words people write.',
    lessonCount: 5,
    totalXp: 400,
    difficulty: 'intermediate',
    topics: ['Vision', 'Language'],
    image: 'courses/vision-nlp.webp',
    accent: 'green',
  },
  {
    id: 'game-robotics',
    title: 'Game Dev & Robotics',
    description: 'Give game characters a brain and make robots follow smart instructions.',
    lessonCount: 5,
    totalXp: 400,
    difficulty: 'advanced',
    topics: ['Games', 'Robotics'],
    image: 'courses/game-robotics.webp',
    accent: 'orange',
  },
];

/** Teasers rendered as non-interactive "Coming soon" chips (PRD section 4.6). */
export const upcomingCourses = [
  'Generative AI',
  'Prompt Engineering',
  'AI in Science',
  'Web Dev with AI',
] as const;
