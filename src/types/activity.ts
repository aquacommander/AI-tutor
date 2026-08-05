import type { SoundName } from '@/lib/sound';

/**
 * The playable version of each lesson's guided activity.
 *
 * The course material describes these as hands-on tasks with printed cards. On
 * screen they are games a child actually plays: one thing at a time, tap an
 * answer, find out straight away whether it worked and why.
 *
 * There is no artwork, so the picture set is emoji rendered very large, and the
 * "tricky" versions from the lesson — shadows, blur, partial views — are made
 * with CSS. That is not a compromise on the teaching: a silhouette really does
 * remove colour and texture while leaving shape, which is exactly the point
 * lesson 1 is making.
 */

/** How a picture is made hard to read, mirroring the lesson's tricky cards. */
export type Treatment = 'silhouette' | 'blur' | 'flip' | 'peek' | 'dim' | 'costume';

export type RoundVisual =
  | { kind: 'emoji'; emoji: string; label: string; treatment?: Treatment }
  | { kind: 'sound'; sound: SoundName; label: string }
  | { kind: 'pair'; left: string; right: string; label: string }
  | { kind: 'quote'; text: string; label: string };

export interface RoundOption {
  id: string;
  label: string;
  emoji?: string;
}

export interface GameRound {
  id: string;
  visual: RoundVisual;
  question: string;
  options: RoundOption[];
  /** Must match one option id; a fixture enforces it. */
  answer: string;
  explanation: string;
  /** Extra evidence a child may ask for before answering. */
  clue?: string;
}

export interface ActivityGame {
  /** `courseId/lessonId`. */
  lessonKey: string;
  title: string;
  intro: string;
  rounds: GameRound[];
  outro: string;
}
