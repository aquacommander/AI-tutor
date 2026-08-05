import type { Treatment } from '@/types/activity';

/**
 * Two-Clue Animal Challenge — the independent mission for Course 1, Lesson 1.
 *
 * The guided activity walks a child through eight fixed pictures. This is the
 * step *after* that, so it is shorter, randomised, and has no hand-holding:
 * three pictures drawn from twelve, a wider set of categories, and clue cards
 * that cover feathers, scales and shells rather than just cats and dogs.
 *
 * One deliberate contrast with the guided activity: there, a fox had to be
 * "Need More Information" because the only folders were cat, dog and rabbit.
 * Here fox is a category of its own, and the honest answer changes. Whether
 * "unsure" is right depends on what the categories are — which is a real idea
 * about classifiers, not a technicality.
 */

export interface ChallengeClue {
  id: string;
  label: string;
  emoji: string;
}

/** The ten clue cards from the activity specification. */
export const CHALLENGE_CLUES: ChallengeClue[] = [
  { id: 'ears', label: 'Ear shape', emoji: '👂' },
  { id: 'tail', label: 'Tail shape', emoji: '〰️' },
  { id: 'body', label: 'Body shape', emoji: '🫥' },
  { id: 'feet', label: 'Feet or paws', emoji: '🐾' },
  { id: 'face', label: 'Face shape', emoji: '😺' },
  { id: 'colour', label: 'Colour', emoji: '🎨' },
  { id: 'covering', label: 'Fur, feathers, scales or shell', emoji: '🧶' },
  { id: 'blurry', label: 'The picture is blurry', emoji: '🌫️' },
  { id: 'hidden', label: 'Part of the animal is hidden', emoji: '🫣' },
  { id: 'wearing', label: 'The animal is wearing something', emoji: '🎭' },
];

export type AnimalId =
  | 'cat'
  | 'dog'
  | 'rabbit'
  | 'fox'
  | 'turtle'
  | 'bird'
  | 'horse'
  | 'fish'
  | 'unsure';

export const ANIMALS: Array<{ id: AnimalId; label: string; emoji: string }> = [
  { id: 'cat', label: 'Cat', emoji: '🐱' },
  { id: 'dog', label: 'Dog', emoji: '🐶' },
  { id: 'rabbit', label: 'Rabbit', emoji: '🐰' },
  { id: 'fox', label: 'Fox', emoji: '🦊' },
  { id: 'turtle', label: 'Turtle', emoji: '🐢' },
  { id: 'bird', label: 'Bird', emoji: '🐦' },
  { id: 'horse', label: 'Horse', emoji: '🐴' },
  { id: 'fish', label: 'Fish', emoji: '🐠' },
  { id: 'unsure', label: 'Need More Information', emoji: '🔎' },
];

export interface ChallengePicture {
  id: string;
  emoji: string;
  /** Describes what is visible without naming the answer. */
  label: string;
  treatment?: Treatment;
  answer: AnimalId;
  relevantClues: string[];
  bestClues: [string, string];
  teaching: string;
}

export const CHALLENGE_PICTURES: ChallengePicture[] = [
  {
    id: 'cat',
    emoji: '🐱',
    label: 'A small animal with pointed ears and whiskers',
    answer: 'cat',
    relevantClues: ['ears', 'tail', 'face', 'feet', 'covering', 'body'],
    bestClues: ['ears', 'face'],
    teaching: 'Pointed ears and a round face are the fastest way to spot a cat.',
  },
  {
    id: 'dog',
    emoji: '🐶',
    label: 'An animal with a longer snout and floppy ears',
    answer: 'dog',
    relevantClues: ['face', 'body', 'tail', 'feet', 'covering', 'ears'],
    bestClues: ['face', 'body'],
    teaching: 'A longer snout and a bigger body separate dogs from cats.',
  },
  {
    id: 'rabbit',
    emoji: '🐰',
    label: 'An animal with very tall ears',
    answer: 'rabbit',
    relevantClues: ['ears', 'tail', 'feet', 'covering', 'body'],
    bestClues: ['ears', 'feet'],
    teaching: 'Long ears and large back feet — no other pet has that combination.',
  },
  {
    id: 'fox',
    emoji: '🦊',
    label: 'An orange animal with pointed ears and a bushy tail',
    answer: 'fox',
    relevantClues: ['ears', 'tail', 'face', 'colour', 'covering'],
    bestClues: ['colour', 'tail'],
    teaching:
      'A fox! In the last activity you had to say "not sure" about this one, because fox was not a folder. Now it is — so the honest answer changed.',
  },
  {
    id: 'turtle',
    emoji: '🐢',
    label: 'An animal with a hard patterned shell',
    answer: 'turtle',
    relevantClues: ['covering', 'body', 'feet', 'face'],
    bestClues: ['covering', 'body'],
    teaching: 'The shell does it. Covering is a clue that works for feathers and scales too.',
  },
  {
    id: 'bird',
    emoji: '🐦',
    label: 'A small animal with feathers and a beak',
    answer: 'bird',
    relevantClues: ['covering', 'body', 'feet', 'face'],
    bestClues: ['covering', 'face'],
    teaching: 'Feathers and a beak. Two clues that no other animal here has.',
  },
  {
    id: 'horse',
    emoji: '🐴',
    label: 'A large animal with a long face and mane',
    answer: 'horse',
    relevantClues: ['body', 'face', 'tail', 'feet', 'covering'],
    bestClues: ['body', 'face'],
    teaching: 'Size and that long face. Body shape is often the first clue for a big animal.',
  },
  {
    id: 'fish',
    emoji: '🐠',
    label: 'An animal with fins and shiny scales',
    answer: 'fish',
    relevantClues: ['covering', 'body', 'tail', 'colour'],
    bestClues: ['covering', 'body'],
    teaching: 'Scales and fins. No ears or feet to help you here — the covering does the work.',
  },
  {
    id: 'toy',
    emoji: '🧸',
    label: 'An animal-shaped object with a smooth stitched surface',
    answer: 'unsure',
    relevantClues: ['covering', 'body', 'face', 'colour'],
    bestClues: ['covering', 'face'],
    teaching:
      'It is shaped like an animal, but it is a toy. When a picture is not a real animal at all, "Need More Information" is the honest answer.',
  },
  {
    id: 'blurry-horse',
    emoji: '🐴',
    label: 'A very blurry picture of a large animal',
    treatment: 'blur',
    answer: 'horse',
    relevantClues: ['blurry', 'body', 'tail'],
    bestClues: ['body', 'blurry'],
    teaching:
      'Blurring wipes out small details first. The big body shape survives, and here it is enough.',
  },
  {
    id: 'hidden',
    emoji: '🐾',
    label: 'Only one paw is visible; the rest is behind something',
    treatment: 'peek',
    answer: 'unsure',
    relevantClues: ['hidden', 'feet', 'covering'],
    bestClues: ['hidden', 'feet'],
    teaching:
      'One paw could belong to a cat, a dog or a fox. Not enough evidence — and saying so is the right call.',
  },
  {
    id: 'costume',
    emoji: '🐕',
    label: 'An animal wearing a headband with fake ears',
    treatment: 'costume',
    answer: 'dog',
    relevantClues: ['wearing', 'face', 'body', 'tail', 'feet'],
    bestClues: ['wearing', 'face'],
    teaching:
      'The costume adds clues that are not part of the animal. Look past it — the face and body still say dog.',
  },
];

/** Points, per the activity specification. */
export const CHALLENGE_SCORING = {
  animal: 50,
  clue: 20,
  explanation: 10,
  rounds: 3,
  perRound: 100,
  total: 300,
  /** 210 of 300. */
  passMark: 210,
} as const;

export const TWO_CLUE_BADGE = 'two-clue-detective-star';

export function animalLabel(id: AnimalId): string {
  return ANIMALS.find((animal) => animal.id === id)?.label ?? id;
}

export function challengeClueLabel(id: string): string {
  return CHALLENGE_CLUES.find((clue) => clue.id === id)?.label.toLowerCase() ?? id;
}

/** Three different pictures, in a random order. */
export function pickThree(): ChallengePicture[] {
  const pool = [...CHALLENGE_PICTURES];
  const chosen: ChallengePicture[] = [];
  while (chosen.length < CHALLENGE_SCORING.rounds && pool.length > 0) {
    const [picked] = pool.splice(Math.floor(Math.random() * pool.length), 1);
    if (picked) chosen.push(picked);
  }
  return chosen;
}
