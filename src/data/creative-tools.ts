export type StudioToolId = 'story' | 'art' | 'music';

export interface StudioField {
  id: string;
  label: string;
  type: 'choice' | 'text';
  /** Present for choices. Every option is shown at once, so keep the list short. */
  options?: string[];
  placeholder?: string;
  defaultValue: string;
}

export interface StudioTool {
  id: StudioToolId;
  title: string;
  tagline: string;
  cta: string;
  xpReward: number;
  /** Sets expectations before the child presses the button. */
  note: string;
  fields: StudioField[];
  buildPrompt: (values: Record<string, string>) => string;
}

const value = (values: Record<string, string>, key: string, fallback: string) =>
  values[key]?.trim() || fallback;

export const studioTools: StudioTool[] = [
  {
    id: 'story',
    title: 'Story Weaver',
    tagline: 'Pick the pieces and watch a story appear — with a real AI idea hidden inside it.',
    cta: 'Weave my story',
    xpReward: 40,
    note: 'Every story quietly teaches one idea about how AI actually works.',
    fields: [
      {
        id: 'hero',
        label: 'Who is the hero?',
        type: 'text',
        placeholder: 'A curious fox called Pip',
        defaultValue: 'A curious fox called Pip',
      },
      {
        id: 'setting',
        label: 'Where does it happen?',
        type: 'choice',
        // Kept under ~32 characters: any longer and the closed dropdown has to
        // truncate on a narrow phone, which hides half the choice.
        options: [
          'a forest that whispers',
          'a floating sky city',
          'a lighthouse by the wild sea',
          'a library that rearranges itself',
          'a workshop of unfinished robots',
        ],
        defaultValue: 'a forest that whispers',
      },
      {
        id: 'challenge',
        label: 'What goes wrong?',
        type: 'choice',
        options: [
          'something important goes missing',
          'nobody believes the hero',
          'a machine keeps getting it wrong',
          'two friends fall out',
          'a door with a secret pattern',
        ],
        defaultValue: 'a machine keeps getting it wrong',
      },
      {
        id: 'mood',
        label: 'How should it feel?',
        type: 'choice',
        options: ['warm and gentle', 'funny', 'exciting', 'mysterious', 'brave'],
        defaultValue: 'warm and gentle',
      },
    ],
    buildPrompt: (values) =>
      [
        'Write me a short fairy tale, about 250 words.',
        `The hero is ${value(values, 'hero', 'a curious fox')}.`,
        `It takes place in ${value(values, 'setting', 'a forest that whispers')}.`,
        `The problem is that ${value(values, 'challenge', 'something goes missing')}.`,
        `It should feel ${value(values, 'mood', 'warm and gentle')}.`,
        'Hide one real idea about how AI works inside the magic — training data, pattern',
        'recognition, or learning from mistakes — so the magic IS the idea rather than a',
        'lecture wearing a costume. Do not explain the idea at the end. Let the story carry it.',
        'Give the story a title on the first line.',
      ].join(' '),
  },
  {
    id: 'art',
    title: 'Art Prompter',
    tagline: 'Turn a small idea into a rich description an artist — or an AI — could paint from.',
    cta: 'Build my prompt',
    xpReward: 30,
    note: 'This makes a written description, not a picture. Image generation is not part of this site.',
    fields: [
      {
        id: 'idea',
        label: 'What do you want to see?',
        type: 'text',
        placeholder: 'A robot planting a garden on the moon',
        defaultValue: 'A robot planting a garden on the moon',
      },
      {
        id: 'style',
        label: 'What style?',
        type: 'choice',
        options: [
          'storybook illustration',
          'watercolour',
          'pixel art',
          'paper cut-out',
          'comic book',
          'stained glass',
        ],
        defaultValue: 'storybook illustration',
      },
      {
        id: 'mood',
        label: 'What mood?',
        type: 'choice',
        options: ['cosy', 'dreamy', 'adventurous', 'mysterious', 'joyful'],
        defaultValue: 'dreamy',
      },
    ],
    buildPrompt: (values) =>
      [
        `Turn this idea into one detailed art prompt: "${value(values, 'idea', 'a robot in a garden')}".`,
        `Style: ${value(values, 'style', 'storybook illustration')}.`,
        `Mood: ${value(values, 'mood', 'dreamy')}.`,
        'Describe the subject, the background, the colours, and the lighting in a way an artist',
        'could paint from. Give me the finished prompt as one paragraph, then three short bullet',
        'points suggesting ways I could change it. Do not describe an image you have made —',
        'you are writing a description for someone else to draw.',
      ].join(' '),
  },
  {
    id: 'music',
    title: 'Music Maker',
    tagline: 'Get a blueprint for a piece of music you could actually play or build.',
    cta: 'Compose my blueprint',
    xpReward: 30,
    note: 'This is a plan in words — instruments, tempo, and structure. It does not play sound.',
    fields: [
      {
        id: 'mood',
        label: 'What mood?',
        type: 'choice',
        options: ['happy', 'calm', 'spooky', 'epic', 'silly', 'thoughtful'],
        defaultValue: 'happy',
      },
      {
        id: 'instrument',
        label: 'Lead instrument?',
        type: 'choice',
        options: ['piano', 'guitar', 'violin', 'drums', 'flute', 'synth'],
        defaultValue: 'piano',
      },
      {
        id: 'use',
        label: 'What is it for?',
        type: 'choice',
        options: [
          'a video game level',
          'a film about space',
          'a birthday surprise',
          'a rainy afternoon',
          'a robot marching band',
        ],
        defaultValue: 'a video game level',
      },
    ],
    buildPrompt: (values) =>
      [
        `Give me a blueprint for a short piece of ${value(values, 'mood', 'happy')} music`,
        `led by ${value(values, 'instrument', 'piano')}, made for ${value(values, 'use', 'a game level')}.`,
        'Include: a tempo in beats per minute, which instruments come in and when, a simple',
        'chord idea I could try, and how the piece starts, builds, and ends. Keep it to something',
        'a beginner could actually attempt.',
      ].join(' '),
  },
];
