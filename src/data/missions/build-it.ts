/**
 * "Build it" missions — the independent challenge for lessons whose task is to
 * make a statement and defend it.
 *
 * The course plan phrases these as short written tasks: explain a mistake, write
 * a model card, design a rule. On screen a child builds the same thing by
 * choosing from cards, and the platform assembles the sentence — the objective
 * is the reasoning, and asking a nine-year-old to type it would measure spelling
 * instead.
 *
 * Every mission ends with a **check** question. Building something is not proof
 * of understanding it, and the check is where a child finds out whether they
 * have actually got the idea.
 */

export interface MissionOption {
  id: string;
  label: string;
  emoji: string;
  /** Whether this choice earns points. Weak options are real misconceptions. */
  good: boolean;
}

export interface MissionStepDef {
  id: string;
  question: string;
  /** How many cards to choose. */
  pick: number;
  options: MissionOption[];
}

export interface MissionCheck {
  question: string;
  options: Array<{ id: string; label: string; emoji: string }>;
  answer: string;
  explanation: string;
}

export interface BuildMission {
  lessonKey: string;
  title: string;
  /** Sets the task. Shown before the first step. */
  intro: string;
  steps: MissionStepDef[];
  /** `{0}`, `{1}` … are replaced with the chosen labels, lower-cased. */
  sentence: string;
  check: MissionCheck;
  outro: string;
}

export const POINTS = { choice: 20, check: 40 } as const;

const missions: BuildMission[] = [
  {
    lessonKey: 'ai-detective-academy/glitch-hunt',
    title: 'Glitch Report',
    intro:
      'A machine got something wrong. Write the report an engineer could actually use — no blaming the computer.',
    steps: [
      {
        id: 'what',
        question: 'Which glitch are you reporting?',
        pick: 1,
        options: [
          { id: 'muffin', label: 'A photo app called a muffin a puppy', emoji: '🧁', good: true },
          { id: 'voice', label: 'A voice helper heard "play" instead of "plane"', emoji: '🗣️', good: true },
          { id: 'vacuum', label: 'A robot vacuum stopped at a dark rug', emoji: '🤖', good: true },
        ],
      },
      {
        id: 'cause',
        question: 'What is a possible cause?',
        pick: 1,
        options: [
          { id: 'examples', label: 'It saw too few examples like this one', emoji: '📚', good: true },
          { id: 'unclear', label: 'The input was unclear or noisy', emoji: '🌫️', good: true },
          { id: 'rule', label: 'A rule that does not fit this situation', emoji: '📏', good: true },
          { id: 'stupid', label: 'The computer is stupid', emoji: '🙄', good: false },
          { id: 'lazy', label: 'It was being lazy', emoji: '😴', good: false },
        ],
      },
      {
        id: 'test',
        question: 'What would you try first?',
        pick: 1,
        options: [
          { id: 'one', label: 'Change one thing, then test on new examples', emoji: '1️⃣', good: true },
          { id: 'all', label: 'Change everything at once', emoji: '🌪️', good: false },
          { id: 'restart', label: 'Throw it away and start again', emoji: '🗑️', good: false },
        ],
      },
    ],
    sentence: 'The glitch: {0}. I think it happened because {1}. To check, I would {2}.',
    check: {
      question: 'Which report helps an engineer fix the problem?',
      options: [
        { id: 'cause', label: '"It saw too few examples like this one."', emoji: '🔎' },
        { id: 'stupid', label: '"The computer is stupid."', emoji: '🙄' },
        { id: 'broken', label: '"It just does not work."', emoji: '🤷' },
      ],
      answer: 'cause',
      explanation:
        'Only one of those tells somebody what to change. "Stupid" and "broken" describe a feeling, not a cause.',
    },
    outro: 'That is error analysis: describe it, guess a cause, change one thing, test again.',
  },

  {
    lessonKey: 'ai-detective-academy/ai-detective',
    title: 'Build a Tricky Creature',
    intro:
      'Design a creature that breaks a classifier. Fluffalos are fluffy with cloud tails; Zingbats have wings.',
    steps: [
      {
        id: 'fluffalo',
        question: 'Give it one Fluffalo feature',
        pick: 1,
        options: [
          { id: 'cloud', label: 'A cloud tail', emoji: '☁️', good: true },
          { id: 'fluffy', label: 'A very fluffy body', emoji: '🐑', good: true },
          { id: 'horns', label: 'Round horns', emoji: '🐮', good: true },
        ],
      },
      {
        id: 'zingbat',
        question: 'Now give it one Zingbat feature',
        pick: 1,
        options: [
          { id: 'wings', label: 'Wings', emoji: '🪽', good: true },
          { id: 'zigzag', label: 'A zigzag tail', emoji: '⚡', good: true },
          { id: 'pointy', label: 'Pointy ears', emoji: '🔺', good: true },
        ],
      },
      {
        id: 'verdict',
        question: 'What should the classifier say about your creature?',
        pick: 1,
        options: [
          { id: 'unsure', label: 'Not sure — ask a person', emoji: '🤷', good: true },
          { id: 'fluffalo', label: 'Fluffalo, definitely', emoji: '🐑', good: false },
          { id: 'zingbat', label: 'Zingbat, definitely', emoji: '🦇', good: false },
        ],
      },
    ],
    sentence: 'My creature has {0} and {1}. A good classifier should say: {2}.',
    check: {
      question: 'Why is a creature like yours useful to whoever built the rule?',
      options: [
        { id: 'breaks', label: 'It shows exactly where the rule breaks', emoji: '🔧' },
        { id: 'proves', label: 'It proves the rule is useless', emoji: '💥' },
        { id: 'nothing', label: 'It is not useful — it is just a trick', emoji: '🙈' },
      ],
      answer: 'breaks',
      explanation:
        'A rule that fails on one creature is unfinished, not useless. Finding the edge is how you improve it.',
    },
    outro: 'Finding the case that breaks a rule is the most useful thing a tester can do.',
  },

  {
    lessonKey: 'train-your-robot-brain/feature-find',
    title: 'Pick the Clues',
    intro:
      'Your goal: sort books so they fit on a shelf. Choose the clues a machine should use — and one it must never use.',
    steps: [
      {
        id: 'useful',
        question: 'Which three clues would actually help?',
        pick: 3,
        options: [
          { id: 'height', label: 'How tall the book is', emoji: '📏', good: true },
          { id: 'thickness', label: 'How thick it is', emoji: '📚', good: true },
          { id: 'weight', label: 'How heavy it is', emoji: '⚖️', good: true },
          { id: 'colour', label: 'The colour of the cover', emoji: '🎨', good: false },
          { id: 'liked', label: 'How much you liked it', emoji: '❤️', good: false },
          { id: 'age', label: 'How old the reader is', emoji: '🎂', good: false },
        ],
      },
      {
        id: 'exclude',
        question: 'Which clue must never be used?',
        pick: 1,
        options: [
          { id: 'family', label: 'Which family the reader comes from', emoji: '🚫', good: true },
          { id: 'title', label: 'The title of the book', emoji: '📖', good: false },
          { id: 'shelf', label: 'Which shelf it was on before', emoji: '🗄️', good: false },
        ],
      },
    ],
    sentence: 'To fit books on a shelf I would use {0}. I would never use {1}.',
    check: {
      question: 'What makes a clue a good feature?',
      options: [
        { id: 'goal', label: 'It fits the goal, can be measured, and is safe', emoji: '✅' },
        { id: 'more', label: 'There are as many of them as possible', emoji: '➕' },
        { id: 'clever', label: 'It sounds clever', emoji: '🎩' },
      ],
      answer: 'goal',
      explanation:
        'Relevant, measurable, safe. Colour is measurable but irrelevant here; family is neither safe nor fair.',
    },
    outro: 'The best clue depends entirely on the goal — and some clues are off limits whatever the goal.',
  },

  {
    lessonKey: 'train-your-robot-brain/data-kitchen',
    title: 'Spoil the Recipe',
    intro:
      'Invent one bad ingredient for a dataset, then work out what it would teach the machine.',
    steps: [
      {
        id: 'ingredient',
        question: 'What kind of bad ingredient will you add?',
        pick: 1,
        options: [
          { id: 'duplicate', label: 'The same row copied ten times', emoji: '👯', good: true },
          { id: 'missing', label: 'A row with no label at all', emoji: '❓', good: true },
          { id: 'impossible', label: 'A banana weighing minus four kilograms', emoji: '🍌', good: true },
        ],
      },
      {
        id: 'effect',
        question: 'What would that do to what the machine learns?',
        pick: 1,
        options: [
          { id: 'skew', label: 'Make it think something is more common than it is', emoji: '📊', good: true },
          { id: 'confuse', label: 'Leave it unsure which category things belong to', emoji: '🌀', good: true },
          { id: 'nothing', label: 'Nothing — machines ignore bad data', emoji: '🙈', good: false },
        ],
      },
      {
        id: 'note',
        question: 'What goes in your data note?',
        pick: 1,
        options: [
          { id: 'both', label: 'What I changed and why', emoji: '✍️', good: true },
          { id: 'count', label: 'Just how many rows are left', emoji: '🔢', good: false },
          { id: 'none', label: 'Nothing — the data speaks for itself', emoji: '🤫', good: false },
        ],
      },
    ],
    sentence: 'My bad ingredient is {0}. It would {1}. In my data note I would record {2}.',
    check: {
      question: 'A dataset gets ten times bigger but half of it is duplicated. Is it better?',
      options: [
        { id: 'no', label: 'No — quality matters more than size', emoji: '⚖️' },
        { id: 'yes', label: 'Yes — more data always wins', emoji: '➕' },
        { id: 'same', label: 'It makes no difference at all', emoji: '🤷' },
      ],
      answer: 'no',
      explanation: 'Ten copies of one example is still one example. Size without variety teaches nothing new.',
    },
    outro: 'Good ingredients, better results — and always write down what you changed.',
  },

  {
    lessonKey: 'train-your-robot-brain/mood-mixer',
    title: 'The Two-Way Sentence',
    intro:
      'Build a message that could be read as happy OR cross, depending on what happened just before it.',
    steps: [
      {
        id: 'message',
        question: 'Choose your message',
        pick: 1,
        options: [
          { id: 'great', label: '"Great."', emoji: '💬', good: true },
          { id: 'fine', label: '"That is fine."', emoji: '💬', good: true },
          { id: 'thanks', label: '"Thanks a lot."', emoji: '💬', good: true },
        ],
      },
      {
        id: 'happy',
        question: 'What context would make it POSITIVE?',
        pick: 1,
        options: [
          { id: 'won', label: 'They just won a prize', emoji: '🏆', good: true },
          { id: 'helped', label: 'A friend just helped them', emoji: '🤝', good: true },
          { id: 'nothing', label: 'Nothing — context never matters', emoji: '🚫', good: false },
        ],
      },
      {
        id: 'sad',
        question: 'And what would make the SAME words negative?',
        pick: 1,
        options: [
          { id: 'flat', label: 'Their bike just got a flat tyre', emoji: '🚲', good: true },
          { id: 'late', label: 'Someone let them down again', emoji: '⏰', good: true },
          { id: 'caps', label: 'They used a capital letter', emoji: '🔠', good: false },
        ],
      },
    ],
    sentence: 'My message is {0}. It sounds positive after {1}, but negative after {2}.',
    check: {
      question: 'Can a machine know exactly how the writer felt?',
      options: [
        { id: 'no', label: 'No — it can only estimate from the signals it has', emoji: '📶' },
        { id: 'yes', label: 'Yes, if the message is long enough', emoji: '📜' },
        { id: 'always', label: 'Yes — that is what sentiment analysis means', emoji: '🤖' },
      ],
      answer: 'no',
      explanation:
        'It estimates tone from words and context. Feelings live in the person, not in the message.',
    },
    outro: 'The same words, two meanings. That is why sarcasm is so hard for a machine.',
  },

  {
    lessonKey: 'train-your-robot-brain/robot-brain',
    title: 'Write the Model Card',
    intro: 'Publish an honest report on your rule. Honest means including what it still gets wrong.',
    steps: [
      {
        id: 'goal',
        question: 'What was the goal?',
        pick: 1,
        options: [
          { id: 'fruit', label: 'Tell apples from bananas', emoji: '🍎', good: true },
          { id: 'creature', label: 'Tell Fluffalos from Zingbats', emoji: '🐑', good: true },
          { id: 'sound', label: 'Tell a bird from a clock', emoji: '🐦', good: true },
        ],
      },
      {
        id: 'strength',
        question: 'What is it good at?',
        pick: 1,
        options: [
          { id: 'clear', label: 'Clear, well-lit examples', emoji: '☀️', good: true },
          { id: 'common', label: 'The kinds it saw most often', emoji: '📚', good: true },
          { id: 'everything', label: 'Everything, perfectly', emoji: '💯', good: false },
        ],
      },
      {
        id: 'limit',
        question: 'What does it still get wrong?',
        pick: 1,
        options: [
          { id: 'unusual', label: 'Unusual angles and poor light', emoji: '🌑', good: true },
          { id: 'rare', label: 'Kinds it hardly ever saw', emoji: '🦄', good: true },
          { id: 'nothing', label: 'Nothing — it has no limits', emoji: '🚫', good: false },
        ],
      },
    ],
    sentence: 'Goal: {0}. Strength: {1}. Limitation: {2}.',
    check: {
      question: 'Why publish the limitation at all?',
      options: [
        { id: 'trust', label: 'So people know when NOT to rely on it', emoji: '🛡️' },
        { id: 'modest', label: 'To look modest', emoji: '🙇' },
        { id: 'never', label: 'You should not — it makes the work look bad', emoji: '🙈' },
      ],
      answer: 'trust',
      explanation:
        'A model card is a safety document. Hiding the limits is how people get hurt trusting a tool too far.',
    },
    outro: 'An honest report of what fails is worth more than a perfect-sounding one.',
  },

  {
    lessonKey: 'ai-game-creator-lab/game-hero',
    title: 'Write a Safety Rule',
    intro: 'Your hero needs one rule that keeps the game fair or keeps a player safe.',
    steps: [
      {
        id: 'input',
        question: 'What does the game notice? (the IF)',
        pick: 1,
        options: [
          { id: 'health', label: 'The hero has one heart left', emoji: '❤️', good: true },
          { id: 'stranger', label: 'A stranger asks for the player’s name', emoji: '🕵️', good: true },
          { id: 'cheat', label: 'A player has moved impossibly fast', emoji: '⚡', good: true },
        ],
      },
      {
        id: 'action',
        question: 'What should happen? (the THEN)',
        pick: 1,
        options: [
          { id: 'protect', label: 'Stop and protect the player', emoji: '🛡️', good: true },
          { id: 'ask', label: 'Ask a grown-up before continuing', emoji: '🧑‍🤝‍🧑', good: true },
          { id: 'ignore', label: 'Carry on as normal', emoji: '🤷', good: false },
        ],
      },
      {
        id: 'priority',
        question: 'Where does this rule sit?',
        pick: 1,
        options: [
          { id: 'top', label: 'At the very top — it beats every other rule', emoji: '🥇', good: true },
          { id: 'bottom', label: 'At the bottom, after the fun rules', emoji: '🎈', good: false },
          { id: 'anywhere', label: 'Anywhere — order does not matter', emoji: '🔀', good: false },
        ],
      },
    ],
    sentence: 'IF {0}, THEN {1}. This rule sits {2}.',
    check: {
      question: 'Two rules are both true at once and disagree. What decides?',
      options: [
        { id: 'priority', label: 'The priority you set in advance', emoji: '📋' },
        { id: 'first', label: 'Whichever was written first', emoji: '1️⃣' },
        { id: 'random', label: 'The game picks at random', emoji: '🎲' },
      ],
      answer: 'priority',
      explanation:
        'Without a decided order, behaviour depends on luck. Safety rules go at the top, always.',
    },
    outro: 'Input, action, priority. That is a rule an engine can actually run.',
  },

  {
    lessonKey: 'ai-game-creator-lab/choice-engine',
    title: 'The Permission Rule',
    intro: 'Write a rule that asks before the game uses anything private about the player.',
    steps: [
      {
        id: 'trigger',
        question: 'When should the game ask?',
        pick: 1,
        options: [
          { id: 'name', label: 'Before showing the player’s name to others', emoji: '🏷️', good: true },
          { id: 'location', label: 'Before using where the player is', emoji: '📍', good: true },
          { id: 'photo', label: 'Before using a photo of the player', emoji: '📷', good: true },
        ],
      },
      {
        id: 'how',
        question: 'How should it ask?',
        pick: 1,
        options: [
          { id: 'plain', label: 'In plain words, saying why it wants it', emoji: '💬', good: true },
          { id: 'tiny', label: 'In tiny writing at the bottom', emoji: '🔬', good: false },
          { id: 'assume', label: 'Not at all — just assume yes', emoji: '🤫', good: false },
        ],
      },
      {
        id: 'no',
        question: 'What if the player says no?',
        pick: 1,
        options: [
          { id: 'works', label: 'The game still works, just without that bit', emoji: '✅', good: true },
          { id: 'blocked', label: 'The game refuses to start', emoji: '🚫', good: false },
          { id: 'nag', label: 'It keeps asking until they agree', emoji: '🔁', good: false },
        ],
      },
    ],
    sentence: 'IF the game wants to use {0}, THEN it must ask {1}. If the answer is no, {2}.',
    check: {
      question: 'What should an app always tell you when it asks for something?',
      options: [
        { id: 'why', label: 'Why it needs it, in words you understand', emoji: '❓' },
        { id: 'nothing', label: 'Nothing — that would make the form long', emoji: '📄' },
        { id: 'later', label: 'Only if you ask first', emoji: '🙋' },
      ],
      answer: 'why',
      explanation:
        'If an app cannot explain why it needs something, that is your answer about whether to give it.',
    },
    outro: 'Asking properly means saying why, and taking no for an answer.',
  },

  {
    lessonKey: 'ai-game-creator-lab/maze-mission',
    title: 'Re-plan the Route',
    intro: 'Your robot has a route. Then the map changes — work out what it should do.',
    steps: [
      {
        id: 'change',
        question: 'What changed in the maze?',
        pick: 1,
        options: [
          { id: 'rock', label: 'A rock now blocks the short route', emoji: '🪨', good: true },
          { id: 'lava', label: 'Lava appeared across the middle', emoji: '🌋', good: true },
          { id: 'door', label: 'A locked door opened', emoji: '🚪', good: true },
        ],
      },
      {
        id: 'response',
        question: 'What should the robot do?',
        pick: 1,
        options: [
          { id: 'replan', label: 'Re-plan with the new information', emoji: '🔄', good: true },
          { id: 'push', label: 'Follow the old plan anyway', emoji: '➡️', good: false },
          { id: 'stop', label: 'Stop and give up', emoji: '🛑', good: false },
        ],
      },
      {
        id: 'cost',
        question: 'What are you counting when you compare the new routes?',
        pick: 1,
        options: [
          { id: 'time', label: 'How long it takes', emoji: '⏱️', good: true },
          { id: 'risk', label: 'How risky it is', emoji: '⚠️', good: true },
          { id: 'pretty', label: 'How pretty the route looks', emoji: '🌸', good: false },
        ],
      },
    ],
    sentence: '{0}, so the robot should {1}. I would compare the routes by {2}.',
    check: {
      question: 'Is the shortest route always the best one?',
      options: [
        { id: 'depends', label: 'No — it depends what "cost" means for this job', emoji: '⚖️' },
        { id: 'yes', label: 'Yes, shortest always wins', emoji: '📏' },
        { id: 'longest', label: 'No — the longest is always safest', emoji: '🐢' },
      ],
      answer: 'depends',
      explanation:
        'Deciding what you are counting — time, risk, energy — comes before deciding which route wins.',
    },
    outro: 'A plan is a best guess with the information you had. New information, new plan.',
  },

  {
    lessonKey: 'smart-and-safe-ai-heroes/privacy-mission',
    title: 'Redesign the Form',
    intro:
      'A drawing app wants to sign you up. Its purpose: save your drawings so you can find them again. Strip the form back.',
    steps: [
      {
        id: 'keep',
        question: 'Which two boxes does it actually need?',
        pick: 2,
        options: [
          { id: 'nickname', label: 'A nickname', emoji: '🏷️', good: true },
          { id: 'password', label: 'A password', emoji: '🔑', good: true },
          { id: 'address', label: 'Home address', emoji: '🏠', good: false },
          { id: 'school', label: 'School name', emoji: '🏫', good: false },
          { id: 'phone', label: 'Phone number', emoji: '📱', good: false },
        ],
      },
      {
        id: 'soften',
        question: 'It wants your exact birthday. What is safer?',
        pick: 1,
        options: [
          { id: 'band', label: 'An age band, like 9–12', emoji: '📊', good: true },
          { id: 'exact', label: 'The exact date — more accurate', emoji: '📅', good: false },
          { id: 'year', label: 'Just the year you were born', emoji: '🗓️', good: true },
        ],
      },
      {
        id: 'delete',
        question: 'When should it delete what it stored?',
        pick: 1,
        options: [
          { id: 'purpose', label: 'When you stop using the app', emoji: '🗑️', good: true },
          { id: 'never', label: 'Never — it might be useful one day', emoji: '♾️', good: false },
          { id: 'sold', label: 'When someone offers to buy it', emoji: '💰', good: false },
        ],
      },
    ],
    sentence: 'My form asks only for {0}. Instead of an exact birthday it asks for {1}. It deletes everything {2}.',
    check: {
      question: 'What is data minimization?',
      options: [
        { id: 'need', label: 'Collecting only what a clear purpose needs', emoji: '✂️' },
        { id: 'small', label: 'Making the writing on the form smaller', emoji: '🔬' },
        { id: 'lots', label: 'Collecting lots, in case it is useful later', emoji: '📦' },
      ],
      answer: 'need',
      explanation:
        'Every extra box is something that can leak. If the purpose does not need it, do not ask.',
    },
    outro: 'Ask of every box: does the purpose really need this? Usually it does not.',
  },

  {
    lessonKey: 'smart-and-safe-ai-heroes/truth-tracker',
    title: 'The Kind Reply',
    intro:
      'A friend shared something that might not be true. Write a reply that helps without telling them they are wrong.',
    steps: [
      {
        id: 'open',
        question: 'How do you start?',
        pick: 1,
        options: [
          { id: 'interesting', label: '"That is interesting — where did you see it?"', emoji: '🙂', good: true },
          { id: 'curious', label: '"I want to check this too. Who posted it?"', emoji: '🤔', good: true },
          { id: 'wrong', label: '"That is fake. You are wrong."', emoji: '😠', good: false },
        ],
      },
      {
        id: 'check',
        question: 'What do you suggest checking?',
        pick: 1,
        options: [
          { id: 'source', label: 'Who said it, and when', emoji: '📰', good: true },
          { id: 'second', label: 'Whether anyone else reliable reported it', emoji: '🔍', good: true },
          { id: 'likes', label: 'How many likes it has', emoji: '👍', good: false },
        ],
      },
      {
        id: 'meanwhile',
        question: 'What should you both do in the meantime?',
        pick: 1,
        options: [
          { id: 'wait', label: 'Not share it until we know more', emoji: '⏸️', good: true },
          { id: 'share', label: 'Share it with a warning', emoji: '⚠️', good: false },
          { id: 'delete', label: 'Tell everyone they are gullible', emoji: '📢', good: false },
        ],
      },
    ],
    sentence: 'I would say: {0} Then I would suggest checking {1}. Until we know, {2}.',
    check: {
      question: 'Two million people shared it. Does that make it true?',
      options: [
        { id: 'no', label: 'No — popularity is not evidence', emoji: '🚫' },
        { id: 'yes', label: 'Yes — that many people cannot be wrong', emoji: '👥' },
        { id: 'verified', label: 'Yes, if the account has a tick', emoji: '✅' },
      ],
      answer: 'no',
      explanation:
        'A false thing shared two million times is still false. Sharing counts measure interest, not truth.',
    },
    outro: 'Asking where something came from is kinder — and more useful — than calling it fake.',
  },
];

export const buildMissions = missions;

export function findBuildMission(lessonKey: string): BuildMission | undefined {
  return missions.find((mission) => mission.lessonKey === lessonKey);
}

/** Total points available: one per choice card, plus the check. */
export function missionMaxScore(mission: BuildMission): number {
  const choices = mission.steps.reduce((total, step) => total + step.pick, 0);
  return choices * POINTS.choice + POINTS.check;
}
