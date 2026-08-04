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
export type Treatment = 'silhouette' | 'blur' | 'flip' | 'peek' | 'dim';

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

const SORT_OPTIONS: RoundOption[] = [
  { id: 'cat', label: 'Cat', emoji: '🐱' },
  { id: 'dog', label: 'Dog', emoji: '🐶' },
  { id: 'unsure', label: 'Not sure', emoji: '🤷' },
];

const mysteryPictureSort: ActivityGame = {
  lessonKey: 'ai-detective-academy/picture-clue-patrol',
  title: 'Mystery Picture Sort',
  intro: 'Twelve pictures have arrived at the Pixel Pet Shelter. Sort each one for Pip!',
  outro:
    'You just did what an image classifier does — looked for clues, matched patterns, and said "not sure" when the clues ran out.',
  rounds: [
    {
      id: 'clear-cat',
      visual: { kind: 'emoji', emoji: '🐱', label: 'A cat' },
      question: 'Which folder does this go in?',
      options: SORT_OPTIONS,
      answer: 'cat',
      explanation: 'Easy one! Pointy ears, whiskers, round face.',
    },
    {
      id: 'clear-dog',
      visual: { kind: 'emoji', emoji: '🐶', label: 'A dog' },
      question: 'Which folder does this go in?',
      options: SORT_OPTIONS,
      answer: 'dog',
      explanation: 'Floppy ears and a long snout — that is a dog.',
    },
    {
      id: 'clear-cat-2',
      visual: { kind: 'emoji', emoji: '🐈', label: 'A cat walking' },
      question: 'Which folder does this go in?',
      options: SORT_OPTIONS,
      answer: 'cat',
      explanation: 'A different pose, but the same clues: ears, tail, body shape.',
    },
    {
      id: 'clear-dog-2',
      visual: { kind: 'emoji', emoji: '🦮', label: 'A guide dog' },
      question: 'Which folder does this go in?',
      options: SORT_OPTIONS,
      answer: 'dog',
      explanation: 'Still a dog, even wearing a harness.',
    },
    {
      id: 'silhouette-cat',
      visual: { kind: 'emoji', emoji: '🐈', label: 'A dark shadow of an animal', treatment: 'silhouette' },
      question: 'All you can see is the shadow. What is it?',
      options: SORT_OPTIONS,
      answer: 'cat',
      clue: 'Look at the ears — are they pointy or floppy?',
      explanation: 'The colour has gone, but the shape stayed. Pointy ears and a long curved tail: cat.',
    },
    {
      id: 'blurry-dog',
      visual: { kind: 'emoji', emoji: '🐕', label: 'A blurry animal', treatment: 'blur' },
      question: 'This picture is very blurry. What is it?',
      options: SORT_OPTIONS,
      answer: 'dog',
      clue: 'Blurry pictures still keep their big shapes.',
      explanation: 'Even blurred, the body shape and snout say dog. Small details vanish first.',
    },
    {
      id: 'upside-down-cat',
      visual: { kind: 'emoji', emoji: '🐈‍⬛', label: 'An upside-down cat', treatment: 'flip' },
      question: 'Someone turned this picture upside down!',
      options: SORT_OPTIONS,
      answer: 'cat',
      explanation:
        'Turning a picture upside down does not change what it is — but it can really confuse an AI that only ever saw the right way up.',
    },
    {
      id: 'peek-dog',
      visual: { kind: 'emoji', emoji: '🐩', label: 'Half of an animal', treatment: 'peek' },
      question: 'Only part of the picture is showing. What is it?',
      options: SORT_OPTIONS,
      answer: 'dog',
      clue: 'You can only see one half. Is that enough?',
      explanation: 'A poodle. Curly fur and that snout are enough clues, even from half a picture.',
    },
    {
      id: 'fox',
      visual: { kind: 'emoji', emoji: '🦊', label: 'A fox' },
      question: 'Careful — which folder?',
      options: SORT_OPTIONS,
      answer: 'unsure',
      clue: 'Pointy ears and fur... but do foxes belong in the cat folder?',
      explanation:
        'It is a fox! It shares clues with cats — pointy ears, fur, a long tail — but it is neither a cat nor a dog. "Not sure" is the honest answer.',
    },
    {
      id: 'teddy',
      visual: { kind: 'emoji', emoji: '🧸', label: 'A teddy bear' },
      question: 'And this one?',
      options: SORT_OPTIONS,
      answer: 'unsure',
      explanation:
        'It looks like an animal, but it is a toy. The shelter only takes real pets, so this needs a human to decide.',
    },
    {
      id: 'wolf-shadow',
      visual: { kind: 'emoji', emoji: '🐺', label: 'A shadow that could be a dog or a wolf', treatment: 'silhouette' },
      question: 'A shadow again. Dog?',
      options: SORT_OPTIONS,
      answer: 'unsure',
      clue: 'Lots of animals have that shape.',
      explanation:
        'It was a wolf. The shadow looks almost exactly like a dog, so there simply is not enough to be sure. Saying so is better than guessing.',
    },
    {
      id: 'dim-cat',
      visual: { kind: 'emoji', emoji: '🐈', label: 'A cat in very dim light', treatment: 'dim' },
      question: 'Last one — the light is very low.',
      options: SORT_OPTIONS,
      answer: 'cat',
      explanation:
        'Dim light makes it harder, but the clues are still there. This is why AI needs to see pictures in all sorts of lighting while it learns.',
    },
  ],
};

const SOUND_OPTIONS: RoundOption[] = [
  { id: 'rain', label: 'Rain', emoji: '🌧️' },
  { id: 'bird', label: 'A bird', emoji: '🐦' },
  { id: 'tapping', label: 'Tapping', emoji: '👆' },
  { id: 'roar', label: 'A big animal', emoji: '🦁' },
  { id: 'applause', label: 'Clapping', emoji: '👏' },
  { id: 'splash', label: 'Water splash', emoji: '💦' },
];

const soundSafari: ActivityGame = {
  lessonKey: 'ai-detective-academy/sound-safari',
  title: 'Eyes-Closed Sound Hunt',
  intro: 'The Jungle Radio lost all its labels. Press play, listen, and tell Pip what made each sound.',
  outro:
    'You used pitch, rhythm and loudness to decide — the very same clues a computer measures when it listens.',
  rounds: [
    {
      id: 'rain',
      visual: { kind: 'sound', sound: 'rain', label: 'A long hissing sound' },
      question: 'What made this sound?',
      options: SOUND_OPTIONS,
      answer: 'rain',
      explanation: 'Rain is lots of tiny sounds at once, with no clear rhythm. That hiss is the clue.',
    },
    {
      id: 'bird',
      visual: { kind: 'sound', sound: 'bird', label: 'Short high sounds' },
      question: 'And this one?',
      options: SOUND_OPTIONS,
      answer: 'bird',
      explanation: 'Very high pitch, short and repeated. Birds sit right at the top of the pitch range.',
    },
    {
      id: 'tapping',
      visual: { kind: 'sound', sound: 'tapping', label: 'Evenly spaced knocks' },
      question: 'What is this?',
      options: SOUND_OPTIONS,
      answer: 'tapping',
      clue: 'Count the beats. Are they evenly spaced?',
      explanation: 'Steady, evenly spaced and short. Rhythm is the clue here, not pitch.',
    },
    {
      id: 'roar',
      visual: { kind: 'sound', sound: 'roar', label: 'A deep rumbling sound' },
      question: 'Something big is nearby...',
      options: SOUND_OPTIONS,
      answer: 'roar',
      explanation: 'Very low pitch and long. Big animals make low sounds; small ones make high sounds.',
    },
    {
      id: 'applause',
      visual: { kind: 'sound', sound: 'applause', label: 'Many short sharp sounds together' },
      question: 'Lots of little sounds at once. What is it?',
      options: SOUND_OPTIONS,
      answer: 'applause',
      clue: 'It sounds a bit like rain — what is different?',
      explanation:
        'Clapping is sharper and more uneven than rain. They are easy to mix up, and computers mix them up too.',
    },
    {
      id: 'splash',
      visual: { kind: 'sound', sound: 'splash', label: 'A short wet sound' },
      question: 'Last sound!',
      options: SOUND_OPTIONS,
      answer: 'splash',
      explanation: 'A splash starts loud and dies away fast. That shape is its fingerprint.',
    },
  ],
};

const SOURCE_OPTIONS: RoundOption[] = [
  { id: 'human', label: 'A person made it', emoji: '🧑‍🎨' },
  { id: 'machine', label: 'A machine made it', emoji: '🤖' },
  { id: 'unsure', label: 'Not enough clues', emoji: '🤷' },
];

const gallerySourceInvestigation: ActivityGame = {
  lessonKey: 'ai-detective-academy/human-or-machine',
  title: 'Gallery Source Investigation',
  intro:
    'Six creations arrived with no labels. Decide who made each one — and remember, guessing wrong about a person is unfair.',
  outro:
    'The best detectives said "not enough clues" more than once. Strong evidence beats a strong feeling every time.',
  rounds: [
    {
      id: 'perfect-landscape',
      visual: { kind: 'emoji', emoji: '🏞️', label: 'A perfect-looking landscape' },
      question: 'This landscape looks flawless. Who made it?',
      options: SOURCE_OPTIONS,
      answer: 'unsure',
      clue: 'Being very neat is not proof of anything.',
      explanation:
        'Looking perfect proves nothing. Photographers, painters and machines can all make a flawless picture.',
    },
    {
      id: 'six-fingers',
      visual: { kind: 'emoji', emoji: '🖐️', label: 'A drawing of a hand with too many fingers' },
      question: 'This drawing has six fingers on one hand.',
      options: SOURCE_OPTIONS,
      answer: 'unsure',
      clue: 'Have you ever drawn a hand wrong?',
      explanation:
        'A famous "AI mistake" — but people draw hands badly all the time. One odd detail is a weak clue, not proof.',
    },
    {
      id: 'sketchbook',
      visual: { kind: 'emoji', emoji: '📓', label: 'A sketchbook with rough early drawings' },
      question: 'The artist showed their sketchbook of rough early versions.',
      options: SOURCE_OPTIONS,
      answer: 'human',
      explanation:
        'Now that is strong evidence. Seeing the working — the messy first tries — tells you how it was made.',
    },
    {
      id: 'repeated-poem',
      visual: {
        kind: 'quote',
        text: 'The sky is blue and bright and blue,\nthe sea is bright and blue and bright.',
        label: 'A poem repeating the same words',
      },
      question: 'This poem repeats the same few words. Who wrote it?',
      options: SOURCE_OPTIONS,
      answer: 'unsure',
      explanation:
        'Repetition happens in machine text — and in poems by children, and on purpose in real poetry. Not enough to accuse anyone.',
    },
    {
      id: 'file-history',
      visual: { kind: 'emoji', emoji: '🗂️', label: 'A file history showing a generator was used' },
      question: 'The file history records which tool made this image.',
      options: SOURCE_OPTIONS,
      answer: 'machine',
      explanation:
        'The record of how a file was made is the strongest clue there is. Much better than a feeling about how it looks.',
    },
    {
      id: 'friend-said',
      visual: { kind: 'quote', text: 'My friend said it looks like AI.', label: 'A friend’s opinion' },
      question: 'Your friend is sure it was made by AI. Are you?',
      options: SOURCE_OPTIONS,
      answer: 'unsure',
      explanation:
        'Someone else being confident is not evidence. Saying "I do not know" protects people from unfair accusations.',
    },
  ],
};

const glitchCaseFiles: ActivityGame = {
  lessonKey: 'ai-detective-academy/glitch-hunt',
  title: 'Glitch Case Files',
  intro: 'Three machines are broken. Find the cause of each one, then choose the first thing to try.',
  outro:
    'You changed one thing at a time and tested on something new — that is exactly how real engineers fix an AI.',
  rounds: [
    {
      id: 'muffin',
      visual: { kind: 'pair', left: '🧁', right: '🐶', label: 'A muffin labelled as a puppy' },
      question: 'The sorter called this muffin a puppy. Why?',
      options: [
        { id: 'similar', label: 'Muffins and puppies look alike', emoji: '👀' },
        { id: 'funny', label: 'The computer is being silly', emoji: '😜' },
        { id: 'broken', label: 'The screen is broken', emoji: '🖥️' },
      ],
      answer: 'similar',
      clue: 'Squint at both pictures. Round, brown, blobby...',
      explanation:
        'Round and brown with dark spots — to a pattern matcher they really are alike. It needs more varied examples.',
    },
    {
      id: 'muffin-fix',
      visual: { kind: 'emoji', emoji: '🔧', label: 'A spanner' },
      question: 'What should we try FIRST to fix it?',
      options: [
        { id: 'examples', label: 'Show it more different muffins and puppies', emoji: '🖼️' },
        { id: 'everything', label: 'Change everything at once', emoji: '🌪️' },
        { id: 'delete', label: 'Delete the puppy folder', emoji: '🗑️' },
      ],
      answer: 'examples',
      explanation:
        'One change at a time. If you change everything, you never find out which fix actually worked.',
    },
    {
      id: 'plane',
      visual: { kind: 'pair', left: '✈️', right: '▶️', label: 'The word plane heard as play' },
      question: 'A voice helper hears "play" when the child says "plane". Why?',
      options: [
        { id: 'sound', label: 'The two words sound very similar', emoji: '👂' },
        { id: 'accent', label: 'The helper dislikes planes', emoji: '😠' },
        { id: 'colour', label: 'The screen colour is wrong', emoji: '🎨' },
      ],
      answer: 'sound',
      explanation:
        'Only the ending differs. Add background noise and the two become almost impossible to tell apart.',
    },
    {
      id: 'vacuum',
      visual: { kind: 'pair', left: '🤖', right: '⬛', label: 'A robot vacuum stopping at a dark rug' },
      question: 'The robot vacuum always stops at the dark rug. What is happening?',
      options: [
        { id: 'hole', label: 'It thinks the dark rug is a hole', emoji: '🕳️' },
        { id: 'tired', label: 'It is tired', emoji: '😴' },
        { id: 'rug', label: 'It does not like the pattern', emoji: '🌀' },
      ],
      answer: 'hole',
      clue: 'How does a robot tell the floor from a step?',
      explanation:
        'Its sensor reads dark as "drop!" and it stops to protect itself. The rule is sensible — it just does not fit this situation.',
    },
    {
      id: 'test',
      visual: { kind: 'emoji', emoji: '🧪', label: 'A test tube' },
      question: 'You made a fix. How do you know it really worked?',
      options: [
        { id: 'new', label: 'Test it on NEW pictures it has never seen', emoji: '🆕' },
        { id: 'same', label: 'Test it on the same pictures again', emoji: '🔁' },
        { id: 'hope', label: 'Just hope for the best', emoji: '🤞' },
      ],
      answer: 'new',
      explanation:
        'Old pictures may just have been memorised. Only something new proves it actually learned.',
    },
  ],
};

const creatureClassifierLab: ActivityGame = {
  lessonKey: 'ai-detective-academy/build-the-picture-detective',
  title: 'Creature Classifier Lab',
  intro:
    'New creatures have arrived from Planet Pattern. Build a rule to tell them apart — then test it on creatures nobody has seen before.',
  outro:
    'You trained a rule, tested it on unseen creatures, and found where it broke. That is the whole job of building an AI.',
  rounds: [
    {
      id: 'training',
      visual: { kind: 'pair', left: '🐑', right: '🦇', label: 'A Fluffalo and a Zingbat' },
      question: 'Fluffalos are fluffy with cloud tails. Zingbats have wings. Which clue tells them apart best?',
      options: [
        { id: 'wings', label: 'Does it have wings?', emoji: '🪽' },
        { id: 'colour', label: 'What colour is it?', emoji: '🎨' },
        { id: 'size', label: 'How big is it?', emoji: '📏' },
      ],
      answer: 'wings',
      clue: 'Which clue is different for every Fluffalo and every Zingbat?',
      explanation:
        'Wings split them perfectly. Colour and size vary within each kind, so they would not help.',
    },
    {
      id: 'unseen-1',
      visual: { kind: 'emoji', emoji: '🐑', label: 'A fluffy creature with no wings' },
      question: 'A creature nobody has seen before. Use your rule!',
      options: [
        { id: 'fluffalo', label: 'Fluffalo', emoji: '🐑' },
        { id: 'zingbat', label: 'Zingbat', emoji: '🦇' },
        { id: 'unsure', label: 'Not sure', emoji: '🤷' },
      ],
      answer: 'fluffalo',
      explanation: 'No wings, so your rule says Fluffalo. The rule worked.',
    },
    {
      id: 'unseen-2',
      visual: { kind: 'emoji', emoji: '🦇', label: 'A winged creature' },
      question: 'And this one?',
      options: [
        { id: 'fluffalo', label: 'Fluffalo', emoji: '🐑' },
        { id: 'zingbat', label: 'Zingbat', emoji: '🦇' },
        { id: 'unsure', label: 'Not sure', emoji: '🤷' },
      ],
      answer: 'zingbat',
      explanation: 'Wings, so Zingbat. Two out of two.',
    },
    {
      id: 'conflict',
      visual: { kind: 'pair', left: '🦇', right: '☁️', label: 'A creature with wings AND a cloud tail' },
      question: 'Uh oh — this one has wings AND a cloud tail. What now?',
      options: [
        { id: 'fluffalo', label: 'Fluffalo', emoji: '🐑' },
        { id: 'zingbat', label: 'Zingbat', emoji: '🦇' },
        { id: 'unsure', label: 'Not sure', emoji: '🤷' },
      ],
      answer: 'unsure',
      clue: 'Your rule says one thing. The tail says another.',
      explanation:
        'Your rule and the tail disagree, so there is no safe answer. This is where a good system says "not sure" and asks a person.',
    },
    {
      id: 'improve',
      visual: { kind: 'emoji', emoji: '🛠️', label: 'Tools' },
      question: 'Your rule broke on that one. What is the best thing to do?',
      options: [
        { id: 'collect', label: 'Collect more examples and improve the rule', emoji: '📚' },
        { id: 'ignore', label: 'Ignore that creature', emoji: '🙈' },
        { id: 'scrap', label: 'Throw the whole rule away', emoji: '💥' },
      ],
      answer: 'collect',
      explanation:
        'A rule that fails on one creature is not a bad rule — it is an unfinished one. More examples make it better.',
    },
  ],
};

export const activityGames: ActivityGame[] = [
  mysteryPictureSort,
  soundSafari,
  gallerySourceInvestigation,
  glitchCaseFiles,
  creatureClassifierLab,
];

export function findActivityGame(courseId: string, lessonId: string): ActivityGame | undefined {
  return activityGames.find((game) => game.lessonKey === `${courseId}/${lessonId}`);
}
