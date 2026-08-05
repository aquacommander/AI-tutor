import type { Treatment } from '@/types/activity';

/**
 * Mystery Picture Sort — the guided activity for Course 1, Lesson 1.
 *
 * Richer than the other activities because the lesson's objective is not just
 * "pick the right folder" but "identify two visible clues that support the
 * answer". So every round is answered twice: a category, then the evidence for
 * it. The platform assembles the sentence, because the objective is the
 * reasoning, not the typing.
 *
 * The shelter takes **real animals only**, stated up front. Without that rule
 * the toy-cat round would be unfair — the lesson material raises exactly this
 * point: "the label depends on the mission: are we sorting by appearance or by
 * what the object truly is?"
 */

export interface ClueCard {
  id: string;
  label: string;
  emoji: string;
}

/** Every clue a child can pick, in every round. */
export const CLUE_CARDS: ClueCard[] = [
  { id: 'long-ears', label: 'Long ears', emoji: '👂' },
  { id: 'pointed-ears', label: 'Pointed ears', emoji: '🔺' },
  { id: 'round-tail', label: 'Round tail', emoji: '⚪' },
  { id: 'long-tail', label: 'Long tail', emoji: '〰️' },
  { id: 'back-feet', label: 'Large back feet', emoji: '🦶' },
  { id: 'paw-shape', label: 'Paw shape', emoji: '🐾' },
  { id: 'face-shape', label: 'Face shape', emoji: '😺' },
  { id: 'body-shape', label: 'Body shape', emoji: '🫥' },
  { id: 'fur', label: 'Fur texture', emoji: '🧶' },
  { id: 'plastic', label: 'Plastic texture', emoji: '🧴' },
  { id: 'blurry', label: 'The picture is blurry', emoji: '🌫️' },
  { id: 'hidden', label: 'Part of the animal is hidden', emoji: '🫣' },
  { id: 'costume', label: 'Costume or fake body parts', emoji: '🎭' },
];

export type CategoryId = 'cat' | 'dog' | 'rabbit' | 'unsure';

export const CATEGORIES: Array<{ id: CategoryId; label: string; emoji: string }> = [
  { id: 'cat', label: 'Cat', emoji: '🐱' },
  { id: 'dog', label: 'Dog', emoji: '🐶' },
  { id: 'rabbit', label: 'Rabbit', emoji: '🐰' },
  { id: 'unsure', label: 'Need More Information', emoji: '🔎' },
];

export interface SortRound {
  id: string;
  emoji: string;
  /** Describes what is visible, without naming the answer. */
  label: string;
  treatment?: Treatment;
  answer: CategoryId;
  /** Clues genuinely visible in this picture. Each is worth points. */
  relevantClues: string[];
  /** The two the tutor would point at, used when revealing the answer. */
  bestClues: [string, string];
  /** Shown once the round is finished, whatever the outcome. */
  teaching: string;
}

export const SORT_ROUNDS: SortRound[] = [
  {
    id: 'clear-cat',
    emoji: '🐱',
    label: 'A cat, clearly visible',
    answer: 'cat',
    relevantClues: ['pointed-ears', 'long-tail', 'face-shape', 'fur', 'paw-shape'],
    bestClues: ['pointed-ears', 'face-shape'],
    teaching: 'Pointed ears and a round face are two of the strongest cat clues.',
  },
  {
    id: 'clear-dog',
    emoji: '🐶',
    label: 'A dog, clearly visible',
    answer: 'dog',
    relevantClues: ['face-shape', 'body-shape', 'long-tail', 'paw-shape', 'fur'],
    bestClues: ['face-shape', 'body-shape'],
    teaching: 'A longer snout and a bigger body shape separate dogs from cats.',
  },
  {
    id: 'clear-rabbit',
    emoji: '🐰',
    label: 'A rabbit, clearly visible',
    answer: 'rabbit',
    relevantClues: ['long-ears', 'round-tail', 'back-feet', 'fur', 'face-shape'],
    bestClues: ['long-ears', 'back-feet'],
    teaching: 'Long ears and large back feet make rabbits easy to tell apart.',
  },
  {
    id: 'fox',
    emoji: '🦊',
    label: 'An animal with pointed ears and a long bushy tail',
    answer: 'unsure',
    relevantClues: ['pointed-ears', 'long-tail', 'face-shape', 'fur'],
    bestClues: ['pointed-ears', 'long-tail'],
    teaching:
      'This is a fox. It really does share clues with cats — but a fox is not a cat, a dog or a rabbit, so none of our folders fit.',
  },
  {
    id: 'toy-cat',
    emoji: '🧸',
    label: 'A cat-shaped object with a smooth shiny surface',
    answer: 'unsure',
    relevantClues: ['plastic', 'face-shape', 'pointed-ears', 'body-shape'],
    bestClues: ['plastic', 'face-shape'],
    teaching:
      'It is shaped like a cat, but that shiny surface is plastic — it is a toy. The shelter only takes real animals, so a person needs to decide.',
  },
  {
    id: 'dog-in-ears',
    emoji: '🐕',
    label: 'A dog wearing a headband with fake pointed ears',
    treatment: 'costume',
    answer: 'dog',
    relevantClues: ['costume', 'face-shape', 'body-shape', 'long-tail', 'paw-shape'],
    bestClues: ['costume', 'face-shape'],
    teaching:
      'The fake ears are a trap! Costumes add clues that are not really part of the animal. The face and body still say dog.',
  },
  {
    id: 'blurry-rabbit',
    emoji: '🐰',
    label: 'A very blurry animal with tall ears',
    treatment: 'blur',
    answer: 'rabbit',
    relevantClues: ['blurry', 'long-ears', 'back-feet', 'body-shape'],
    bestClues: ['long-ears', 'back-feet'],
    teaching:
      'Blurring removes the small details first. The big shapes — those long ears — survive, and they are enough.',
  },
  {
    id: 'hidden',
    emoji: '🐾',
    label: 'Only one paw is showing; the rest is behind a box',
    treatment: 'peek',
    answer: 'unsure',
    relevantClues: ['hidden', 'paw-shape', 'fur'],
    bestClues: ['hidden', 'paw-shape'],
    teaching:
      'One paw is not enough. Cats, dogs and rabbits can all have paws like that — this needs more information.',
  },
];

/** Points, per the activity specification. */
export const SCORING = {
  category: 50,
  firstClue: 20,
  secondClue: 20,
  explanation: 10,
  perRound: 100,
  total: SORT_ROUNDS.length * 100,
  /** 70% of 800. */
  passMark: Math.round(SORT_ROUNDS.length * 100 * 0.7),
} as const;

export function clueLabel(clueId: string): string {
  return CLUE_CARDS.find((clue) => clue.id === clueId)?.label.toLowerCase() ?? clueId;
}

export function categoryLabel(categoryId: CategoryId): string {
  return CATEGORIES.find((category) => category.id === categoryId)?.label ?? categoryId;
}
