import type { Lesson, LessonVideo } from '@/types/course';

/**
 * Lesson timings, taken from the real film rather than the plan.
 *
 * The course material specifies "Exactly 10 minutes" of video per lesson and
 * builds the 30-45 minute lesson estimate on top of that. The delivered film for
 * lesson 1 runs 3:08. Printing "10 min" next to a three-minute video is the kind
 * of small dishonesty a parent notices immediately, so every time shown on
 * screen is computed from the file that actually exists.
 *
 * Lessons with no film yet keep the document's figures, which are still the
 * best estimate available for them.
 */

export interface MinuteRange {
  min: number;
  max: number;
}

/** Reads "10 min", "10–12 min" or "12-15 min". */
export function parseMinutes(text: string): MinuteRange | null {
  const match = /(\d+)\s*(?:[–—-]\s*(\d+))?/.exec(text);
  if (!match?.[1]) return null;

  const min = Number(match[1]);
  const max = match[2] ? Number(match[2]) : min;
  return { min, max };
}

export function formatMinutes(range: MinuteRange): string {
  return range.min === range.max ? `${range.min} min` : `${range.min}–${range.max} min`;
}

/** Whole minutes of film, never rounding a real video down to zero. */
export function videoMinutes(video: LessonVideo): number {
  return Math.max(1, Math.round(video.durationSeconds / 60));
}

/** "3:08" — the exact length, for anyone who wants it. */
export function formatDuration(seconds: number): string {
  const whole = Math.round(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

/** The time to show for one stage, with the film's real length substituted. */
export function stageTime(componentName: string, planned: string, video?: LessonVideo): string {
  if (componentName !== 'Lesson video' || !video) return planned;
  return `${videoMinutes(video)} min`;
}

/**
 * Total learner time, summed from the stages.
 *
 * Computed rather than taken from the document, because swapping a 10-minute
 * film for a 3-minute one has to move the total too — otherwise the lesson still
 * claims 30-45 minutes while being seven minutes shorter.
 */
export function lessonTime(lesson: Lesson, video?: LessonVideo): string {
  const total = lesson.components.reduce<MinuteRange | null>((sum, component) => {
    const range = parseMinutes(stageTime(component.name, component.time, video));
    if (!range) return sum;
    return sum ? { min: sum.min + range.min, max: sum.max + range.max } : range;
  }, null);

  if (!total) return lesson.learnerTime;
  return total.min === total.max ? `${total.min} minutes` : `${total.min}–${total.max} minutes`;
}

/** Whole-course time, summed from its lessons. */
export function courseTime(
  lessons: Lesson[],
  videoFor: (lesson: Lesson) => LessonVideo | undefined,
): string {
  const total = lessons.reduce<MinuteRange>(
    (sum, lesson) => {
      const parsed = parseMinutes(lessonTime(lesson, videoFor(lesson)));
      const range = parsed ?? { min: 0, max: 0 };
      return { min: sum.min + range.min, max: sum.max + range.max };
    },
    { min: 0, max: 0 },
  );

  const hours = (minutes: number) => Math.round((minutes / 60) * 10) / 10;
  if (total.max < 90) return `${total.min}–${total.max} minutes`;
  return `${hours(total.min)}–${hours(total.max)} hours`;
}
