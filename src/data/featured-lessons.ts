import { courses } from './courses.ts';
import { ROUTES } from '@/lib/constants';
import { parseMinutes } from '@/lib/lesson-time';
import type { CourseAccent, FeaturedLesson } from '@/types/course';

/**
 * The homepage lesson carousel, derived from the real courses.
 *
 * This used to be hand-written marketing copy advertising lessons that were
 * never made. Deriving it means the homepage can only promise missions that
 * exist, each card deep-links to the one it names, and its poster is a frame
 * from that lesson's own film.
 *
 * One from each course, so a visitor sees the whole programme rather than four
 * lessons of Course 1.
 */

const ACCENTS: CourseAccent[] = ['purple', 'blue', 'orange', 'green'];

export const featuredLessons: FeaturedLesson[] = courses
  .map((course, index) => {
    const lesson = course.lessons[0];
    if (!lesson) return null;

    return {
      id: `${course.id}-${lesson.id}`,
      title: lesson.title,
      description: lesson.concept.bigIdea,
      durationMinutes: parseMinutes(lesson.learnerTime)?.min ?? 30,
      difficulty: course.difficulty,
      href: `${ROUTES.courses}/${course.id}/${lesson.id}`,
      image: lesson.video.poster,
      accent: ACCENTS[index] ?? 'purple',
    };
  })
  .filter((lesson): lesson is FeaturedLesson => lesson !== null);
