import { courses, courseTotalXp, courseVideoSeconds } from '@/data/courses';
import type { Course } from '@/types/course';

/**
 * Pricing, as agreed: USD 25 per course, 30% off when all four are taken
 * together.
 *
 * Nothing here charges anybody. Taking money needs a payment processor, a
 * merchant account and a tax registration, none of which exist yet — so the
 * buttons point at whatever `NEXT_PUBLIC_CHECKOUT_*` is configured, and when
 * nothing is configured they say so plainly rather than pretending.
 *
 * A checkout button that silently does nothing is worse than no button: a
 * parent who clicks it and gets nothing assumes the whole site is broken.
 */

export const CURRENCY = 'USD';

/** Per course. Overridable per course id if the flat rate is revisited. */
export const PRICE_PER_COURSE = 25;

/** Bundle discount, as agreed in the pricing discussion. */
export const BUNDLE_DISCOUNT = 0.3;

export function coursePrice(courseId: string): number {
  const override = Number(process.env[`NEXT_PUBLIC_PRICE_${courseId.toUpperCase()}`]);
  return Number.isFinite(override) && override > 0 ? override : PRICE_PER_COURSE;
}

export function fullPrice(): number {
  return courses.reduce((total, course) => total + coursePrice(course.id), 0);
}

export function bundlePrice(): number {
  return Math.round(fullPrice() * (1 - BUNDLE_DISCOUNT));
}

export function bundleSaving(): number {
  return fullPrice() - bundlePrice();
}

export function formatPrice(amount: number): string {
  return `$${amount}`;
}

/**
 * Where a buy button goes. Set one of these when a processor is live:
 *   NEXT_PUBLIC_CHECKOUT_BUNDLE
 *   NEXT_PUBLIC_CHECKOUT_<COURSE_ID>   (hyphens become underscores)
 */
export function checkoutUrl(courseId?: string): string | null {
  const key = courseId
    ? `NEXT_PUBLIC_CHECKOUT_${courseId.toUpperCase().replace(/-/g, '_')}`
    : 'NEXT_PUBLIC_CHECKOUT_BUNDLE';
  const url = process.env[key];
  return url && url.startsWith('http') ? url : null;
}

/** Fallback when there is no checkout yet — a real address beats a dead button. */
export function enquiryEmail(): string | null {
  return process.env.NEXT_PUBLIC_ENQUIRY_EMAIL ?? null;
}

/** What a buyer gets, counted from the course rather than asserted. */
export interface CourseValue {
  lessons: number;
  videoSeconds: number;
  quizQuestions: number;
  activities: number;
  xp: number;
}

export function courseValue(course: Course): CourseValue {
  return {
    lessons: course.lessons.length,
    videoSeconds: courseVideoSeconds(course),
    quizQuestions: course.lessons.reduce((total, lesson) => total + lesson.quiz.length, 0),
    // One guided activity and one independent mission per lesson.
    activities: course.lessons.length * 2,
    xp: courseTotalXp(course),
  };
}

/**
 * The free sample.
 *
 * Nobody pays $25 for a children's course sight unseen, least of all a parent
 * who has never heard of us. The first mission of the first course is free and
 * complete — film, activity, mission and quiz — so the decision to buy is made
 * after seeing the real thing rather than a marketing page.
 */
export const FREE_LESSON = { courseId: 'ai-detective-academy', lessonId: 'picture-clue-patrol' };

export function isFree(courseId: string, lessonId: string): boolean {
  return courseId === FREE_LESSON.courseId && lessonId === FREE_LESSON.lessonId;
}
