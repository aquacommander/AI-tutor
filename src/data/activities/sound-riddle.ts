import type { SoundName } from '@/lib/sound';

/**
 * Sound Riddle Challenge — the independent mission for Course 1, Lesson 2.
 *
 * The written mission asks a child to "give someone three clues about a sound —
 * how high or low it is, its rhythm, how loud it is — without naming what makes
 * it". That is exactly this: describe the sound in three measurable ways, and
 * only then guess the source.
 *
 * Every clue accepts **more than one answer**, because these sounds genuinely
 * are ambiguous. Rain reads as high or mixed depending on what a child listens
 * for; a bird's chirping is repeating or irregular depending on whether you
 * hear the pattern or the gaps. Marking one of those wrong would teach a child
 * to distrust their own ears, which is the opposite of the lesson.
 */

export type PitchId = 'high' | 'low' | 'mixed';
export type RhythmId = 'steady' | 'repeating' | 'fast' | 'slow' | 'irregular';
export type VolumeId = 'soft' | 'medium' | 'loud';

export const PITCH_OPTIONS: Array<{ id: PitchId; label: string; emoji: string }> = [
  { id: 'high', label: 'High', emoji: '⬆️' },
  { id: 'low', label: 'Low', emoji: '⬇️' },
  { id: 'mixed', label: 'Mixed', emoji: '↕️' },
];

export const RHYTHM_OPTIONS: Array<{ id: RhythmId; label: string; emoji: string }> = [
  { id: 'steady', label: 'Steady', emoji: '⏱️' },
  { id: 'repeating', label: 'Repeating', emoji: '🔁' },
  { id: 'fast', label: 'Fast', emoji: '⚡' },
  { id: 'slow', label: 'Slow', emoji: '🐢' },
  { id: 'irregular', label: 'Irregular', emoji: '〽️' },
];

export const VOLUME_OPTIONS: Array<{ id: VolumeId; label: string; emoji: string }> = [
  { id: 'soft', label: 'Soft', emoji: '🔈' },
  { id: 'medium', label: 'Medium', emoji: '🔉' },
  { id: 'loud', label: 'Loud', emoji: '🔊' },
];

export interface SourceCard {
  id: string;
  label: string;
  emoji: string;
}

export interface RiddleRound {
  id: string;
  sound: SoundName;
  /** The true source. */
  answer: string;
  sources: SourceCard[];
  /** Every reading a careful listener could defend. */
  pitch: PitchId[];
  rhythm: RhythmId[];
  volume: VolumeId[];
  /** How the answer is described when it is finally revealed. */
  reveal: { pitch: string; rhythm: string; volume: string };
  /**
   * A written description for anyone who cannot use the audio — enough to solve
   * the round without hearing it, and it never names the source.
   */
  visualClue: string;
  teaching: string;
}

const UNSURE: SourceCard = { id: 'unsure', label: 'Need More Information', emoji: '🔎' };

export const RIDDLE_ROUNDS: RiddleRound[] = [
  {
    id: 'bird',
    sound: 'bird',
    answer: 'bird',
    sources: [
      { id: 'bird', label: 'Bird', emoji: '🐦' },
      { id: 'drum', label: 'Drum', emoji: '🥁' },
      { id: 'train', label: 'Train', emoji: '🚂' },
      { id: 'rain', label: 'Rain', emoji: '🌧️' },
      UNSURE,
    ],
    pitch: ['high'],
    rhythm: ['repeating', 'irregular', 'fast'],
    volume: ['soft', 'medium'],
    reveal: { pitch: 'high', rhythm: 'repeating', volume: 'soft' },
    visualClue: 'Very short sounds, right at the top of the pitch range, repeated four times, not loud.',
    teaching: 'Small animals make high sounds. Pitch alone almost gives this one away.',
  },
  {
    id: 'dog',
    sound: 'dog',
    answer: 'dog',
    sources: [
      { id: 'dog', label: 'Dog', emoji: '🐶' },
      { id: 'bird', label: 'Bird', emoji: '🐦' },
      { id: 'clock', label: 'Clock', emoji: '⏰' },
      { id: 'rain', label: 'Rain', emoji: '🌧️' },
      UNSURE,
    ],
    pitch: ['low', 'mixed'],
    rhythm: ['irregular', 'repeating'],
    volume: ['loud', 'medium'],
    reveal: { pitch: 'low', rhythm: 'irregular', volume: 'loud' },
    visualClue: 'Two short bursts with a gap between them. Much lower than a bird, and much louder.',
    teaching: 'Bigger animals make lower sounds — the opposite end of the range from the bird.',
  },
  {
    id: 'clock',
    sound: 'clock',
    answer: 'clock',
    sources: [
      { id: 'clock', label: 'Clock', emoji: '⏰' },
      { id: 'drum', label: 'Drum', emoji: '🥁' },
      { id: 'train', label: 'Train', emoji: '🚂' },
      { id: 'bird', label: 'Bird', emoji: '🐦' },
      UNSURE,
    ],
    pitch: ['high', 'mixed'],
    rhythm: ['steady', 'repeating', 'slow'],
    volume: ['soft'],
    reveal: { pitch: 'high', rhythm: 'steady', volume: 'soft' },
    visualClue: 'Tiny clicks, exactly the same distance apart every time, very quiet.',
    teaching:
      'Rhythm solves this one. Nothing else here is that perfectly even — a machine keeps better time than a living thing.',
  },
  {
    id: 'train',
    sound: 'train',
    answer: 'train',
    sources: [
      { id: 'train', label: 'Train', emoji: '🚂' },
      { id: 'rain', label: 'Rain', emoji: '🌧️' },
      { id: 'bird', label: 'Bird', emoji: '🐦' },
      { id: 'clock', label: 'Clock', emoji: '⏰' },
      UNSURE,
    ],
    pitch: ['low'],
    rhythm: ['steady', 'repeating', 'slow'],
    volume: ['loud', 'medium'],
    reveal: { pitch: 'low', rhythm: 'steady', volume: 'loud' },
    visualClue: 'A long low rumble that never stops, with a heavy beat rolling over the top of it.',
    teaching: 'Low and continuous, with a beat. Big heavy things make low sounds that last.',
  },
  {
    id: 'rain',
    sound: 'rain',
    answer: 'rain',
    sources: [
      { id: 'rain', label: 'Rain', emoji: '🌧️' },
      { id: 'train', label: 'Train', emoji: '🚂' },
      { id: 'drum', label: 'Drum', emoji: '🥁' },
      { id: 'dog', label: 'Dog', emoji: '🐶' },
      UNSURE,
    ],
    pitch: ['high', 'mixed'],
    rhythm: ['irregular', 'fast'],
    volume: ['soft', 'medium'],
    reveal: { pitch: 'mixed', rhythm: 'irregular', volume: 'soft' },
    visualClue: 'Thousands of tiny sounds at once with no pattern at all — a steady hiss, not loud.',
    teaching:
      'Rain has no rhythm you can count. That hiss of many tiny sounds is its fingerprint — and it is easy to confuse with clapping.',
  },
  {
    id: 'drum',
    sound: 'drum',
    answer: 'drum',
    sources: [
      { id: 'drum', label: 'Drum', emoji: '🥁' },
      { id: 'clock', label: 'Clock', emoji: '⏰' },
      { id: 'bird', label: 'Bird', emoji: '🐦' },
      { id: 'rain', label: 'Rain', emoji: '🌧️' },
      UNSURE,
    ],
    pitch: ['low'],
    rhythm: ['steady', 'repeating', 'slow'],
    volume: ['loud'],
    reveal: { pitch: 'low', rhythm: 'steady', volume: 'loud' },
    visualClue: 'Deep, heavy thumps, evenly spaced and loud. You could march to it.',
    teaching:
      'A drum and a clock share a steady rhythm — pitch and volume are what tell them apart.',
  },
];

/** Points, per the activity specification. */
export const RIDDLE_SCORING = {
  source: 40,
  clue: 20,
  perRound: 100,
  total: RIDDLE_ROUNDS.length * 100,
  /** 70% of 600. */
  passMark: Math.round(RIDDLE_ROUNDS.length * 100 * 0.7),
  maxReplays: 3,
} as const;

export const SOUND_DETECTIVE_BADGE = 'sound-detective';
