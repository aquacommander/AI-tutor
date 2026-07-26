import type { ImageKey } from '@/lib/images';
import type { AgeGroupId, ThemeName } from './learner';

/**
 * A tale is written as a sequence of typed blocks rather than a wall of HTML,
 * so the reader can style each kind consistently and a new story needs no new
 * component work.
 */
export type StoryBlock =
  /** Ordinary narrative prose. */
  | { kind: 'prose'; text: string }
  /** A scene break, given its own small heading. */
  | { kind: 'scene'; title: string }
  /** A rhyme, riddle, or incantation — set apart and centred. */
  | { kind: 'verse'; lines: string[] }
  /** A soft aside from the storyteller to the reader. */
  | { kind: 'whisper'; text: string };

export interface Story {
  slug: string;
  title: string;
  /** The storyteller's subtitle, e.g. "A tale of a lamp that learned". */
  subtitle: string;
  /** One-line hook used on cards. */
  teaser: string;
  /** The AI idea the tale carries, named plainly for parents and teachers. */
  concept: string;
  /** How the magic in the story maps onto the real idea. */
  conceptExplainer: string[];
  /** The line the tale leaves you with. */
  moral: string;
  /** Follow-up questions a child can put to Sparky. */
  askSparky: string[];
  ageGroups: AgeGroupId[];
  readingMinutes: number;
  image: ImageKey;
  accent: Extract<ThemeName, 'green' | 'blue' | 'purple' | 'orange'>;
  blocks: StoryBlock[];
}
