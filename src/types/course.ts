import type { ImageKey } from '@/lib/images';
import type { AgeGroupId, ThemeName } from './learner';

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

/** Who is speaking in a scene. Glitch is the character who gets things wrong. */
export type Speaker = 'tutor' | 'glitch';

export interface SpeakerTurn {
  speaker: Speaker;
  text: string;
}

/**
 * One scene of a lesson.
 *
 * These come from the tutor video scripts, and the platform renders them as the
 * readable lesson body. When the films are produced, the player sits above this
 * and the same text becomes the transcript — which the curriculum's own
 * accessibility standard asks for anyway ("non-audio alternatives").
 *
 * `visual` is production direction for the film crew, never shown to a child.
 */
export interface LessonScene {
  id: string;
  label: string;
  /** Timecode in the video script, e.g. "0:00–0:50". */
  time: string;
  turns: SpeakerTurn[];
  visual: string;
  /** Scenes that ask the child to stop and answer become prompt cards. */
  isPause: boolean;
}

/** A point a child can jump to. `sceneId` ties it back to the script. */
export interface VideoChapter {
  sceneId: string;
  label: string;
  start: number;
}

/** Where the player stops itself and waits for the child to think. */
export interface VideoPause {
  sceneId: string;
  at: number;
}

export interface LessonVideo {
  src: string;
  poster: string;
  durationSeconds: number;
  /** WebVTT subtitles. Required before public release. */
  captions?: string;
  chapters: VideoChapter[];
  pauses: VideoPause[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Matches one entry of `options` exactly; enforced by a fixture. */
  answer: string;
  /** Shown after answering, right or wrong. A score alone teaches nothing. */
  explanation: string;
}

export interface LessonActivity {
  title: string;
  purpose: string;
  time: string;
  steps: string[];
}

/**
 * One stage of the lesson, with how long it should take.
 *
 * These timings differ per lesson — the guided activity runs 10-12 minutes in
 * lesson 1 and 15-18 in lesson 5 — so they cannot be derived from the structure
 * and have to be carried from the course material.
 */
export interface LessonComponent {
  name: string;
  time: string;
  purpose: string;
}

export interface Lesson {
  id: string;
  /** 1-indexed position within its course. */
  number: number;
  title: string;
  mission: string;
  concept: string;
  badgeId: string;
  learnerTime: string;
  xpReward: number;
  objectives: string[];
  vocabulary: string[];
  materials: string[];
  /** The lesson's stages and timings, shown to the child as a plan up front. */
  components: LessonComponent[];
  scenes: LessonScene[];
  activity: LessonActivity;
  independentMission: string;
  quiz: QuizQuestion[];
  /** The same lesson, pitched at each age band. */
  differentiation: Record<AgeGroupId, string>;
  misconception: string;
  parentSummary: string;
  /** Assets the video production needs. Never shown to a child. */
  productionAssets: string[];
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  outcomes: string[];
  lessons: Lesson[];
  /** Awarded once every lesson in the course is complete. */
  badgeId: string;
  /** Bonus on top of the lesson XP, for finishing the whole course. */
  completionXp: number;
  difficulty: LessonDifficulty;
  topics: string[];
  image: ImageKey;
  accent: CourseAccent;
  /** `coming-soon` courses appear in the library but cannot be opened. */
  status: 'available' | 'coming-soon';
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
  status: Course['status'];
}

/** Quiz pass mark, from the curriculum's assessment standard: 4 of 5. */
export const QUIZ_PASS_MARK = 4;
