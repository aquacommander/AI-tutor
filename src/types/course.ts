import type { ImageKey } from '@/lib/images';
import type { ThemeName } from './learner';

export type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type CourseAccent = Extract<ThemeName, 'green' | 'blue' | 'purple' | 'orange'>;

export interface FeaturedLesson {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: LessonDifficulty;
  image: ImageKey;
  href: string;
  accent: CourseAccent;
}

export interface LessonVideo {
  src: string;
  poster: ImageKey;
  durationSeconds: number;
  /** WebVTT subtitles. Required by the plan's release checklist. */
  captions?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Matches one entry of `options` exactly; enforced by a fixture. */
  answer: string;
  /** The plan's "why it matters" — shown after every answer, right or wrong. */
  explanation: string;
}

/**
 * The clean text the platform shows straight after the film.
 *
 * The revised plan is blunt about why this exists: "Generated text inside
 * several scenes is misspelled, fragmented or difficult to read. Important
 * definitions must therefore be shown again as clean platform text after the
 * video." So the definition a child reads is never the one burned into the
 * animation.
 */
export interface ConceptCard {
  /** One sentence. Taken from the lesson's own core answer. */
  bigIdea: string;
  vocabulary: string[];
  /** "By the end you can…" */
  objectives: string[];
}

export interface LessonActivity {
  title: string;
  steps: string[];
}

/** How the plan splits a lesson's 30-38 minutes. */
export interface LessonStage {
  name: string;
  minutes: string;
  purpose: string;
}

export interface Lesson {
  id: string;
  /** 1-indexed position within its course. */
  number: number;
  title: string;
  /** Curiosity hook, shown *before* the film. */
  hook: string;
  /** What to look out for while watching. */
  watchFocus: string;
  video: LessonVideo;
  concept: ConceptCard;
  activity: LessonActivity;
  /**
   * The plan phrases this as an instruction to the tutor ("Give the learner a
   * new animal image"). That is what the grown-ups panel shows.
   */
  independentMission: string;
  /** The same task, addressed to the child. This is what the lesson displays. */
  childMission: string;
  quiz: QuizQuestion[];
  /** Adjustments for the bands either side of the 9-12 core audience. */
  adaptation: { younger: string; older: string };
  parentTakeaway: string;
  badgeId: string;
  xpReward: number;
  /** Total learner time, e.g. "30-38 minutes". */
  learnerTime: string;
}

/**
 * The end-of-course project.
 *
 * The plan uses these to carry the learning that the six unmade videos would
 * have held, and makes the course badge conditional on finishing one — "Award
 * the course badge only after the capstone, not after passive video viewing."
 */
export interface Capstone {
  id: string;
  title: string;
  time: string;
  badgeId: string;
  summary: string;
  evidence: string;
  tasks: string[];
  successStandard: string;
  xpReward: number;
}

export interface Course {
  id: string;
  number: number;
  title: string;
  tagline: string;
  outcomes: string[];
  lessons: Lesson[];
  capstone: Capstone;
  difficulty: LessonDifficulty;
  topics: string[];
  image: ImageKey;
  accent: CourseAccent;
}

/** Card-sized view of a course, derived rather than maintained separately. */
export interface CourseSummary {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  totalXp: number;
  difficulty: LessonDifficulty;
  topics: string[];
  image: ImageKey;
  accent: CourseAccent;
}

/**
 * Progress rules, from the plan's "recommended learner progress rules".
 * Kept here so the quiz, the lesson flow and the fixtures read one source.
 */
export const QUIZ_PASS_PERCENT = 80;

/** 80% of five questions. */
export const QUIZ_PASS_MARK = 4;

/** The plan's standard lesson shape, identical across all 14 lessons. */
export const LESSON_STAGES: LessonStage[] = [
  { name: 'Mission hook', minutes: '2–3 min', purpose: 'A question that makes you curious.' },
  { name: 'Watch the mission', minutes: '1–3 min', purpose: 'The film introduces the big idea.' },
  { name: 'Concept card', minutes: '3–4 min', purpose: 'The idea again, in clear words.' },
  { name: 'Guided activity', minutes: '12–15 min', purpose: 'Your turn to play with it.' },
  { name: 'Your own mission', minutes: '5–8 min', purpose: 'Make something without help.' },
  { name: 'Quiz', minutes: '5–7 min', purpose: 'Check what you discovered.' },
];
