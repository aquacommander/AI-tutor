import { courses } from './courses.ts';
import { findLessonVideo } from './lesson-videos.ts';
import { ROUTES } from '@/lib/constants';
import { lessonTime, parseMinutes } from '@/lib/lesson-time';
import type { ImageKey } from '@/lib/images';
import type { CourseAccent, FeaturedLesson } from '@/types/course';

/**
 * The homepage lesson carousel, derived from the real course.
 *
 * This used to be hand-written marketing copy — "Train Your AI", "Build a Smart
 * City" — advertising lessons that were never written and linking to the course
 * index rather than anywhere specific. A visitor clicked one and landed
 * somewhere unrelated.
 *
 * Deriving it from the catalogue means the homepage can only promise lessons
 * that exist, and every card deep-links to the lesson it names.
 */

/** Stand-ins until per-lesson artwork is produced. */
const THUMBNAILS: ImageKey[] = [
  'lessons/train-your-ai.webp',
  'lessons/meet-sparky.webp',
  'lessons/ai-art-studio.webp',
  'lessons/smart-city.webp',
];

const ACCENTS: CourseAccent[] = ['purple', 'blue', 'green', 'orange'];

export const featuredLessons: FeaturedLesson[] = courses
  .filter((course) => course.status === 'available')
  .flatMap((course) =>
    course.lessons.map((lesson) => ({
      id: `${course.id}-${lesson.id}`,
      title: lesson.title,
      description: lesson.mission,
      durationMinutes:
        parseMinutes(lessonTime(lesson, findLessonVideo(course.id, lesson.id)))?.min ?? 30,
      difficulty: course.difficulty,
      href: `${ROUTES.courses}/${course.id}/${lesson.id}`,
    })),
  )
  .slice(0, 4)
  .map((lesson, index) => ({
    ...lesson,
    image: THUMBNAILS[index] ?? 'features/courses.webp',
    accent: ACCENTS[index] ?? 'purple',
  }));
