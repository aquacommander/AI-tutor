import type { ImageKey } from '@/lib/images';
import type { Speaker } from '@/types/course';

/**
 * The cast, as named in the films.
 *
 * The course document lists "Pip, Glitch, Nova and The Tutor", leaving the tutor
 * unnamed. The delivered film names her **Maya** on screen, so that is the name
 * the site uses — a child who watches the video and then reads the page must
 * meet the same person in both.
 *
 * The portraits are frames lifted from the film itself. Not ideal — they are
 * 256px crops of a 720p source — but they are the real characters rather than
 * stand-ins, and they will be replaced by the illustrator's originals when the
 * asset list in the course material is commissioned.
 */
export interface Character {
  id: Speaker;
  name: string;
  /** One line, for a tooltip or an introduction. */
  role: string;
  avatar: ImageKey;
}

export const CHARACTERS: Record<Speaker, Character> = {
  tutor: {
    id: 'tutor',
    name: 'Maya',
    role: 'Your tutor. She explains things and asks good questions.',
    avatar: 'characters/maya.webp',
  },
  glitch: {
    id: 'glitch',
    name: 'Glitch',
    role: 'A funny bug who is confidently wrong, so you can spot the mistake.',
    avatar: 'characters/glitch.webp',
  },
};

/** The learner robot. Not a speaker in the scripts — the child helps him. */
export const PIP: Character = {
  id: 'tutor',
  name: 'Pip',
  role: 'A curious robot who is learning, just like you.',
  avatar: 'characters/pip.webp',
};
