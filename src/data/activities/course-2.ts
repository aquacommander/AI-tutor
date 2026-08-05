import type { ActivityGame, RoundOption } from '@/types/activity';

/** Course 2 — Train Your Robot Brain. */

const GOAL_OPTIONS: RoundOption[] = [
  { id: 'size', label: 'How big it is', emoji: '📏' },
  { id: 'material', label: 'What it is made of', emoji: '🧵' },
  { id: 'where', label: 'Indoors or outdoors', emoji: '🌳' },
];

const threeWayToySort: ActivityGame = {
  lessonKey: 'train-your-robot-brain/feature-find',
  title: 'Three-Way Toy Sort',
  intro:
    'The same toys, three different jobs. Pick the clue that actually helps for each one — the best clue changes when the goal changes.',
  outro:
    'There is no "best clue" on its own. A good feature is one that helps *this* goal, can be measured, and is safe to use.',
  rounds: [
    {
      id: 'storage',
      visual: { kind: 'pair', left: '🧸', right: '📦', label: 'Toys and a storage box' },
      question: 'Goal: fit the toys into storage boxes. Which clue helps most?',
      options: GOAL_OPTIONS,
      answer: 'size',
      explanation: 'For fitting things in a box, size and shape are what matter. Colour would not help at all.',
    },
    {
      id: 'outdoors',
      visual: { kind: 'pair', left: '🪁', right: '🧩', label: 'A kite and a jigsaw' },
      question: 'Goal: pack a bag for the park. Now which clue helps most?',
      options: GOAL_OPTIONS,
      answer: 'where',
      clue: 'Same toys, different job. What matters now?',
      explanation:
        'The toys did not change — the goal did. A kite is for outdoors, a jigsaw is not. Size suddenly matters much less.',
    },
    {
      id: 'washing',
      visual: { kind: 'pair', left: '🧸', right: '🫧', label: 'A soft toy and bubbles' },
      question: 'Goal: work out what can go in the washing machine.',
      options: GOAL_OPTIONS,
      answer: 'material',
      explanation: 'Fabric can be washed; wood and electronics cannot. Material is the clue that fits this goal.',
    },
    {
      id: 'measurable',
      visual: { kind: 'emoji', emoji: '📐', label: 'A ruler' },
      question: 'Which of these is a MEASURABLE clue?',
      options: [
        { id: 'weight', label: 'How heavy it is', emoji: '⚖️' },
        { id: 'fun', label: 'How fun it is', emoji: '🎉' },
        { id: 'best', label: 'Whether it is the best toy', emoji: '🏆' },
      ],
      answer: 'weight',
      clue: 'Could two different people measure it and get the same answer?',
      explanation:
        'Weight can be measured, and everyone gets the same number. "Fun" and "best" change from person to person.',
    },
    {
      id: 'unsafe',
      visual: { kind: 'emoji', emoji: '🛑', label: 'A stop sign' },
      question: 'Which clue should NEVER be used to decide who gets a turn on a toy?',
      options: [
        { id: 'personal', label: 'Where the child lives', emoji: '🏠' },
        { id: 'waited', label: 'How long they have waited', emoji: '⏳' },
        { id: 'order', label: 'Who asked first', emoji: '🙋' },
      ],
      answer: 'personal',
      explanation:
        'Where somebody lives has nothing to do with taking turns. Using it would be unfair — and it is private information nobody needs.',
    },
  ],
};

const cleanTheRecipeData: ActivityGame = {
  lessonKey: 'train-your-robot-brain/data-kitchen',
  title: 'Clean the Recipe Data',
  intro: 'The Data Kitchen fridge is a mess. Check each row before Pip cooks with it.',
  outro:
    'Good ingredients, better results. Duplicates, missing labels, impossible values and imbalance all change what a machine learns.',
  rounds: [
    {
      id: 'duplicate',
      visual: { kind: 'pair', left: '🍎', right: '🍎', label: 'The same apple row twice' },
      question: 'The same apple row appears twice by accident. What is that called?',
      options: [
        { id: 'duplicate', label: 'A duplicate', emoji: '👯' },
        { id: 'missing', label: 'A missing label', emoji: '❓' },
        { id: 'imbalance', label: 'An imbalance', emoji: '⚖️' },
      ],
      answer: 'duplicate',
      explanation:
        'A duplicate. It makes the machine think apples are twice as common as they really are.',
    },
    {
      id: 'missing',
      visual: { kind: 'quote', text: 'colour: red    shape: round    name: ______', label: 'A row with a blank name' },
      question: 'This row has no name. What is the problem?',
      options: [
        { id: 'label', label: 'It has no label, so we cannot learn from it', emoji: '🏷️' },
        { id: 'fine', label: 'Nothing — the computer will guess', emoji: '🤖' },
        { id: 'delete', label: 'Nothing — blank rows are normal', emoji: '📄' },
      ],
      answer: 'label',
      clue: 'How would the machine know what this example is an example OF?',
      explanation:
        'Without a label the example teaches nothing. Either find the right label, or take the row out.',
    },
    {
      id: 'impossible',
      visual: { kind: 'quote', text: 'banana — weight: −4 kg', label: 'A banana weighing minus four kilograms' },
      question: 'A banana weighs minus four kilograms. What should you do?',
      options: [
        { id: 'investigate', label: 'Investigate — a value like this is impossible', emoji: '🔎' },
        { id: 'keep', label: 'Keep it, more data is always better', emoji: '➕' },
        { id: 'zero', label: 'Change it to zero and move on', emoji: '0️⃣' },
      ],
      answer: 'investigate',
      explanation:
        'Nothing weighs less than nothing, so something went wrong when it was recorded. Find out what before you change it.',
    },
    {
      id: 'imbalance',
      visual: { kind: 'pair', left: '🍎🍎🍎🍎🍎🍎🍎🍎', right: '🍌', label: 'Eight apples and one banana' },
      question: 'Eight apples and one banana. What will Pip probably learn?',
      options: [
        { id: 'apples', label: 'To guess "apple" for almost everything', emoji: '🍎' },
        { id: 'both', label: 'Apples and bananas equally well', emoji: '🟰' },
        { id: 'nothing', label: 'Nothing at all', emoji: '🚫' },
      ],
      answer: 'apples',
      clue: 'If you had only ever seen one banana, how sure would you be?',
      explanation:
        'That is imbalance. Guessing "apple" would be right most of the time, so the machine never really learns bananas.',
    },
    {
      id: 'note',
      visual: { kind: 'emoji', emoji: '📝', label: 'A notebook' },
      question: 'You cleaned the data. What should your data note say?',
      options: [
        { id: 'what-why', label: 'What you changed and why', emoji: '✍️' },
        { id: 'count', label: 'Just the number of rows left', emoji: '🔢' },
        { id: 'nothing', label: 'Nothing — the data speaks for itself', emoji: '🤫' },
      ],
      answer: 'what-why',
      explanation:
        'Someone else has to trust your data later. Writing down what changed, and why, is what makes that possible.',
    },
  ],
};

const MOOD_OPTIONS: RoundOption[] = [
  { id: 'positive', label: 'Positive', emoji: '😀' },
  { id: 'negative', label: 'Negative', emoji: '☹️' },
  { id: 'unclear', label: 'Unclear', emoji: '🤷' },
];

const messageMeaningMatch: ActivityGame = {
  lessonKey: 'train-your-robot-brain/mood-mixer',
  title: 'Message Meaning Match',
  intro: 'Read each message and decide the tone. Watch out — some of them change when you learn more.',
  outro:
    'A machine estimates tone from words and context. It never knows how somebody actually feels — and neither do you, without asking.',
  rounds: [
    {
      id: 'clear-positive',
      visual: { kind: 'quote', text: 'I loved the party, thank you for inviting me!', label: 'A warm message' },
      question: 'What is the tone here?',
      options: MOOD_OPTIONS,
      answer: 'positive',
      explanation: '"Loved" and "thank you" are strong positive words, and nothing contradicts them.',
    },
    {
      id: 'clear-negative',
      visual: { kind: 'quote', text: 'I waited an hour and nobody came.', label: 'A disappointed message' },
      question: 'And this one?',
      options: MOOD_OPTIONS,
      answer: 'negative',
      explanation: 'No unkind words at all, but the situation described is a disappointing one.',
    },
    {
      id: 'sarcasm',
      visual: {
        kind: 'quote',
        text: 'Great. My bike has a flat tyre. Again.',
        label: 'A message that says great about a flat tyre',
      },
      question: '"Great" is usually positive. Is it here?',
      options: MOOD_OPTIONS,
      answer: 'negative',
      clue: 'Read the second sentence before you decide about the first.',
      explanation:
        'This is sarcasm — the words say one thing and the context says the opposite. It is one of the hardest things for a machine to spot.',
    },
    {
      id: 'ambiguous',
      visual: { kind: 'quote', text: 'Okay.', label: 'A one-word message' },
      question: 'Just one word. What is the tone?',
      options: MOOD_OPTIONS,
      answer: 'unclear',
      explanation:
        '"Okay" could be happy, cross, or simply busy. There is genuinely not enough here — Unclear is the honest answer.',
    },
    {
      id: 'response',
      visual: { kind: 'emoji', emoji: '💬', label: 'A speech bubble' },
      question: 'A message is unclear. What is the kindest thing to do?',
      options: [
        { id: 'ask', label: 'Ask a kind question to check', emoji: '🙂' },
        { id: 'assume', label: 'Assume they are cross with you', emoji: '😠' },
        { id: 'ignore', label: 'Ignore the message', emoji: '🙈' },
      ],
      answer: 'ask',
      explanation:
        'Asking costs nothing and clears it up. Assuming the worst about an unclear message is how misunderstandings start.',
    },
  ],
};

const robotBrainChampionship: ActivityGame = {
  lessonKey: 'train-your-robot-brain/robot-brain',
  title: 'Robot Brain Championship',
  intro: 'Train Pip, tune him, then open the sealed test. One run only — make it honest.',
  outro:
    'Train, tune, test. Keeping the final test sealed is the only way to find out whether the rule really generalizes.',
  rounds: [
    {
      id: 'training',
      visual: { kind: 'emoji', emoji: '📚', label: 'A stack of labelled cards' },
      question: 'You have 20 labelled cards. What are they for?',
      options: [
        { id: 'train', label: 'Training — building the first rule', emoji: '🏗️' },
        { id: 'test', label: 'Testing how good the finished rule is', emoji: '🧪' },
        { id: 'store', label: 'Storing the answers to look up later', emoji: '🗄️' },
      ],
      answer: 'train',
      explanation: 'Training data is what the rule is built from. Testing comes later, with different cards.',
    },
    {
      id: 'tuning',
      visual: { kind: 'emoji', emoji: '🔧', label: 'A spanner' },
      question: 'Your rule keeps making the same mistake on the tuning cards. What now?',
      options: [
        { id: 'one', label: 'Change one thing, then check again', emoji: '1️⃣' },
        { id: 'all', label: 'Change everything at once to be quick', emoji: '🌪️' },
        { id: 'ignore', label: 'Ignore it — it is only a few cards', emoji: '🙈' },
      ],
      answer: 'one',
      clue: 'If you change three things and it improves, which one helped?',
      explanation:
        'One change at a time is the only way to know which change worked. A repeated mistake is the clearest clue you will get.',
    },
    {
      id: 'peek',
      visual: { kind: 'emoji', emoji: '✉️', label: 'A sealed envelope' },
      question: 'You are stuck. Should you peek at the sealed final test cards?',
      options: [
        { id: 'no', label: 'No — that would spoil the honest test', emoji: '🔒' },
        { id: 'yes', label: 'Yes — you need all the help you can get', emoji: '👀' },
        { id: 'some', label: 'Just one or two would not matter', emoji: '🤏' },
      ],
      answer: 'no',
      explanation:
        'Once you have tuned against the test cards, they are no longer new. The score you get would be a story, not a measurement.',
    },
    {
      id: 'generalize',
      visual: { kind: 'pair', left: '💯', right: '😬', label: 'Perfect on training, poor on new cards' },
      question: 'Pip gets every training card right, but half the new ones wrong. What happened?',
      options: [
        { id: 'memorised', label: 'He memorised instead of learning a pattern', emoji: '🧠' },
        { id: 'unlucky', label: 'He was just unlucky', emoji: '🎲' },
        { id: 'perfect', label: 'Nothing — he is working perfectly', emoji: '✅' },
      ],
      answer: 'memorised',
      explanation:
        'That gap between familiar and new is exactly what "does not generalize" means. The rule fits the old cards too closely.',
    },
    {
      id: 'report',
      visual: { kind: 'emoji', emoji: '📊', label: 'A report card' },
      question: 'Your final report: what should it include?',
      options: [
        { id: 'both', label: 'What worked AND what still fails', emoji: '⚖️' },
        { id: 'good', label: 'Only the good results', emoji: '🌟' },
        { id: 'score', label: 'Only the final score', emoji: '💯' },
      ],
      answer: 'both',
      explanation:
        'An honest report of limits is what lets someone else trust the work — and know when not to rely on it.',
    },
  ],
};

export const course2Activities: ActivityGame[] = [
  threeWayToySort,
  cleanTheRecipeData,
  messageMeaningMatch,
  robotBrainChampionship,
];
