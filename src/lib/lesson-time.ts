import type { Course, Lesson } from '@/types/course';

/**
 * Lesson timings, taken from the real films.
 *
 * The first plan promised "Exactly 10 minutes" of video per lesson; the films
 * that arrived run 0:59 to 3:08. Printing a planned figure next to a real video
 * is the kind of small dishonesty a parent notices immediately, so anything
 * shown on screen is computed from the file.
 */

/** "3:08" — the exact length. */
export function formatDuration(seconds: number): string {
  const whole = Math.round(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

/** Whole minutes of film, never rounding a real video down to zero. */
export function videoMinutes(seconds: number): number {
  return Math.max(1, Math.round(seconds / 60));
}

export interface MinuteRange {
  min: number;
  max: number;
}

/** Reads "30–38 minutes", "12–15 min" or "5 min". */
export function parseMinutes(text: string): MinuteRange | null {
  const match = /(\d+)\s*(?:[–—-]\s*(\d+))?/.exec(text);
  if (!match?.[1]) return null;
  const min = Number(match[1]);
  return { min, max: match[2] ? Number(match[2]) : min };
}

/** Total learner time for a course, summed from its lessons and capstone. */
export function courseTime(course: Course): string {
  const total = [...course.lessons.map((l) => l.learnerTime), course.capstone.time].reduce<MinuteRange>(
    (sum, text) => {
      const range = parseMinutes(text) ?? { min: 0, max: 0 };
      return { min: sum.min + range.min, max: sum.max + range.max };
    },
    { min: 0, max: 0 },
  );

  const hours = (minutes: number) => Math.round((minutes / 60) * 10) / 10;
  if (total.max < 90) return `${total.min}–${total.max} minutes`;
  return `${hours(total.min)}–${hours(total.max)} hours`;
}

/** Film time for one lesson, phrased for a child. */
export function lessonVideoLabel(lesson: Lesson): string {
  return formatDuration(lesson.video.durationSeconds);
}
