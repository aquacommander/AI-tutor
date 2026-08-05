import { aiDetectiveAcademy } from './courses/ai-detective-academy.ts';
import { aiGameCreatorLab } from './courses/ai-game-creator-lab.ts';
import { smartAndSafeAiHeroes } from './courses/smart-and-safe-ai-heroes.ts';
import { trainYourRobotBrain } from './courses/train-your-robot-brain.ts';
import type { Course, CourseSummary } from '@/types/course';

/**
 * The programme, as delivered: four courses of 5/4/3/2 lessons built around the
 * 14 films that exist.
 *
 * The earlier plan promised twenty 10-minute videos; fourteen were made, running
 * 0:59 to 3:08. Rather than pretend otherwise, the revised plan restructures
 * around them and carries the missing learning in four capstone projects. Its
 * own conclusion is worth keeping in view here: "Do not market the product as
 * 'twenty 10-minute video lessons'. The files do not support that claim."
 */
export const courses: Course[] = [
  aiDetectiveAcademy,
  trainYourRobotBrain,
  aiGameCreatorLab,
  smartAndSafeAiHeroes,
];

export const TOTAL_LESSONS = courses.reduce((total, course) => total + course.lessons.length, 0);

export function findCourse(courseId: string): Course | undefined {
  return courses.find((course) => course.id === courseId);
}

export function findLesson(courseId: string, lessonId: string) {
  const course = findCourse(courseId);
  const lesson = course?.lessons.find((entry) => entry.id === lessonId);
  if (!course || !lesson) return undefined;

  // Neighbours are derived here rather than in the page, so previous/next can
  // never disagree with the sidebar about the running order.
  const index = course.lessons.indexOf(lesson);
  return {
    course,
    lesson,
    previous: course.lessons[index - 1],
    next: course.lessons[index + 1],
  };
}

export function findCapstone(courseId: string) {
  const course = findCourse(courseId);
  return course ? { course, capstone: course.capstone } : undefined;
}

/** Lesson XP plus the capstone bonus. */
export function courseTotalXp(course: Course): number {
  return (
    course.lessons.reduce((total, lesson) => total + lesson.xpReward, 0) + course.capstone.xpReward
  );
}

/** Total film time for a course, in seconds. */
export function courseVideoSeconds(course: Course): number {
  return course.lessons.reduce((total, lesson) => total + lesson.video.durationSeconds, 0);
}

/** Card-sized view, derived so the library and the catalogue cannot drift. */
export const courseSummaries: CourseSummary[] = courses.map((course) => ({
  id: course.id,
  title: course.title,
  description: course.tagline,
  lessonCount: course.lessons.length,
  totalXp: courseTotalXp(course),
  difficulty: course.difficulty,
  topics: course.topics,
  image: course.image,
  accent: course.accent,
}));

/** Rendered as non-interactive "Coming soon" chips (PRD section 4.6). */
export const upcomingCourses = [
  'Generative AI',
  'Prompt Engineering',
  'AI in Science',
  'Web Dev with AI',
] as const;
