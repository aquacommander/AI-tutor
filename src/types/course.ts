import type { ImageKey } from '@/lib/images';
import type { ThemeName } from './learner';

export type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface FeaturedLesson {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: LessonDifficulty;
  image: ImageKey;
  href: string;
  accent: Extract<ThemeName, 'green' | 'blue' | 'purple' | 'orange'>;
}

/**
 * Course library shapes. The full lesson/quiz content lands in Milestone 3;
 * these are declared now so the dashboard's "Featured Courses" strip and the
 * homepage can share one vocabulary.
 */
export interface CourseSummary {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  totalXp: number;
  difficulty: LessonDifficulty;
  topics: string[];
  image: ImageKey;
  accent: Extract<ThemeName, 'green' | 'blue' | 'purple' | 'orange'>;
}
