import type { ActivityGame } from '@/types/activity';

/** Course 3 — AI Game Creator Lab. */

const heroBehaviorBuilder: ActivityGame = {
  lessonKey: 'ai-game-creator-lab/game-hero',
  title: 'Hero Behavior Builder',
  intro: 'Nova needs a brain. Decide what she notices, what she remembers, and what she does about it.',
  outro:
    'Input, state, action. A character feels alive because those three fit together — not because anything is thinking.',
  rounds: [
    {
      id: 'input',
      visual: { kind: 'pair', left: '🎮', right: '➡️', label: 'A controller and an arrow' },
      question: 'The player presses the jump button. What is that?',
      options: [
        { id: 'input', label: 'An input', emoji: '🎮' },
        { id: 'state', label: 'A state', emoji: '🧠' },
        { id: 'action', label: 'An action', emoji: '🏃' },
      ],
      answer: 'input',
      explanation: 'An input is anything the game receives from outside — a button, a timer, a collision.',
    },
    {
      id: 'state',
      visual: { kind: 'emoji', emoji: '❤️', label: 'Three hearts' },
      question: 'Nova has 3 hearts left. What is that?',
      options: [
        { id: 'state', label: 'A state', emoji: '🧠' },
        { id: 'input', label: 'An input', emoji: '🎮' },
        { id: 'action', label: 'An action', emoji: '🏃' },
      ],
      answer: 'state',
      clue: 'Is this something the game *remembers*, or something it *receives*?',
      explanation: 'State is what the game remembers between moments. Hearts, score, keys, where you are.',
    },
    {
      id: 'same-input',
      visual: { kind: 'pair', left: '🎮', right: '🔑', label: 'The same button with and without a key' },
      question: 'Nova presses "open" at a locked door. With a key she opens it; without, she cannot. Why?',
      options: [
        { id: 'state', label: 'The state is different — she has a key or she does not', emoji: '🔑' },
        { id: 'broken', label: 'The game is broken', emoji: '🐞' },
        { id: 'random', label: 'The game chose randomly', emoji: '🎲' },
      ],
      answer: 'state',
      explanation:
        'Same input, different state, different action. That is the whole trick behind characters that feel clever.',
    },
    {
      id: 'alive',
      visual: { kind: 'emoji', emoji: '🤖', label: 'A game character' },
      question: 'Nova runs away when a monster appears. Is she alive?',
      options: [
        { id: 'no', label: 'No — she is following a rule somebody wrote', emoji: '📜' },
        { id: 'yes', label: 'Yes — reacting means thinking', emoji: '💭' },
        { id: 'maybe', label: 'Yes, once the game gets complicated enough', emoji: '🌀' },
      ],
      answer: 'no',
      explanation:
        'Reacting is not being alive. "If monster is near, then run" is a rule — an impressive one, but still a rule.',
    },
    {
      id: 'test',
      visual: { kind: 'emoji', emoji: '🧑‍🤝‍🧑', label: 'Two people testing' },
      question: 'Why act your rules out with a partner?',
      options: [
        { id: 'find', label: 'To find the situations you did not think of', emoji: '🔍' },
        { id: 'prove', label: 'To prove your rules are already perfect', emoji: '🏆' },
        { id: 'fun', label: 'Only because it is fun', emoji: '🎈' },
      ],
      answer: 'find',
      explanation:
        'Someone else will always try something you never imagined. That is exactly what you need before players do.',
    },
  ],
};

const guardRuleWorkshop: ActivityGame = {
  lessonKey: 'ai-game-creator-lab/choice-engine',
  title: 'Guard Rule Workshop',
  intro: 'The castle guard needs rules. Write them carefully — players will find every gap.',
  outro:
    'If–then rules are simple until two of them are true at once. Priority and clear feedback are what stop a guard behaving strangely.',
  rounds: [
    {
      id: 'if',
      visual: { kind: 'quote', text: 'IF ______ THEN open the gate', label: 'A rule with a blank condition' },
      question: 'What goes after "IF"?',
      options: [
        { id: 'condition', label: 'Something to check', emoji: '❓' },
        { id: 'action', label: 'Something to do', emoji: '🏃' },
        { id: 'name', label: "The guard's name", emoji: '🏷️' },
      ],
      answer: 'condition',
      explanation: 'After IF comes a condition — something that is either true or false right now.',
    },
    {
      id: 'then',
      visual: { kind: 'quote', text: 'IF the player has a pass THEN ______', label: 'A rule with a blank action' },
      question: 'And after "THEN"?',
      options: [
        { id: 'action', label: 'The action to carry out', emoji: '🏃' },
        { id: 'condition', label: 'Another thing to check', emoji: '❓' },
        { id: 'reason', label: 'The reason for the rule', emoji: '💭' },
      ],
      answer: 'action',
      explanation: 'THEN is what actually happens when the condition is true.',
    },
    {
      id: 'conflict',
      visual: {
        kind: 'quote',
        text: 'Rule 1: IF player has a pass THEN open the gate\nRule 2: IF the alarm is ringing THEN keep the gate shut',
        label: 'Two rules that disagree',
      },
      question: 'The player has a pass AND the alarm is ringing. What is this?',
      options: [
        { id: 'conflict', label: 'A conflict — both rules apply and they disagree', emoji: '⚡' },
        { id: 'bug', label: 'A spelling mistake', emoji: '🔤' },
        { id: 'fine', label: 'Nothing — the guard will work it out', emoji: '🤷' },
      ],
      answer: 'conflict',
      clue: 'Check both conditions. Are they both true?',
      explanation:
        'Both conditions are true and the actions are opposites. The guard cannot do both, so somebody has to decide.',
    },
    {
      id: 'priority',
      visual: { kind: 'emoji', emoji: '🥇', label: 'A first-place medal' },
      question: 'Which rule should win when the alarm is ringing?',
      options: [
        { id: 'safety', label: 'The safety rule — keep the gate shut', emoji: '🛡️' },
        { id: 'pass', label: 'The pass rule — a pass is a pass', emoji: '🎫' },
        { id: 'first', label: 'Whichever was written first', emoji: '1️⃣' },
      ],
      answer: 'safety',
      explanation:
        'Safety rules go at the top. Deciding the order in advance is what priority means — otherwise the behaviour depends on luck.',
    },
    {
      id: 'feedback',
      visual: { kind: 'emoji', emoji: '💬', label: 'A speech bubble' },
      question: 'The gate stays shut. What should the guard say?',
      options: [
        { id: 'why', label: '"Not while the alarm is ringing — come back after."', emoji: '🗣️' },
        { id: 'nothing', label: 'Nothing at all', emoji: '🤐' },
        { id: 'no', label: '"No."', emoji: '🚫' },
      ],
      answer: 'why',
      explanation:
        'A player who knows *why* can do something about it. Silence just looks like a broken game.',
    },
  ],
};

const crystalRouteRace: ActivityGame = {
  lessonKey: 'ai-game-creator-lab/maze-mission',
  title: 'Crystal Route Race',
  intro: 'Two routes to the crystal. Work out which one the robot should take — and why "shortest" is not the answer.',
  outro:
    'A path is a plan, and every plan has a cost. When the map changes, the good move is to re-plan, not to push on regardless.',
  rounds: [
    {
      id: 'path',
      visual: { kind: 'emoji', emoji: '🗺️', label: 'A maze map' },
      question: 'What is a path?',
      options: [
        { id: 'moves', label: 'A sequence of moves from start to goal', emoji: '👣' },
        { id: 'line', label: 'A straight line to the goal', emoji: '📏' },
        { id: 'wall', label: 'A wall that blocks the way', emoji: '🧱' },
      ],
      answer: 'moves',
      explanation: 'A path is the actual list of steps taken — rarely a straight line, because of the walls.',
    },
    {
      id: 'visited',
      visual: { kind: 'emoji', emoji: '🔵', label: 'Marked squares on a grid' },
      question: 'Why mark the squares you have already visited?',
      options: [
        { id: 'repeat', label: 'To avoid going round in circles', emoji: '🔁' },
        { id: 'pretty', label: 'To make the maze look colourful', emoji: '🎨' },
        { id: 'never', label: 'So you can never go back there', emoji: '🚷' },
      ],
      answer: 'repeat',
      clue: 'What happens if you forget where you have been?',
      explanation:
        'Without marking, a robot can loop forever. This is exactly what real pathfinding algorithms do.',
    },
    {
      id: 'cost',
      visual: { kind: 'pair', left: '🏃', right: '🌋', label: 'A short route past lava and a long safe route' },
      question: 'Route A is 6 squares but crosses lava. Route B is 10 squares and is safe. Which is better?',
      options: [
        { id: 'depends', label: 'It depends what "cost" means here', emoji: '⚖️' },
        { id: 'a', label: 'Route A — shortest is always best', emoji: '📏' },
        { id: 'b', label: 'Route B — longest is always safest', emoji: '🐢' },
      ],
      answer: 'depends',
      explanation:
        'If cost is time, A wins. If cost includes risk, B wins. Deciding what you are counting comes first.',
    },
    {
      id: 'obstacle',
      visual: { kind: 'emoji', emoji: '🪨', label: 'A rock blocking the path' },
      question: 'Halfway along, a rock blocks your route. What should the robot do?',
      options: [
        { id: 'replan', label: 'Re-plan using what it now knows', emoji: '🔄' },
        { id: 'push', label: 'Keep following the old plan anyway', emoji: '➡️' },
        { id: 'stop', label: 'Stop and give up', emoji: '🛑' },
      ],
      answer: 'replan',
      explanation:
        'The map changed, so the plan should change. A plan is a best guess with the information you had.',
    },
    {
      id: 'uncertain',
      visual: { kind: 'emoji', emoji: '🌫️', label: 'A foggy unexplored area' },
      question: 'Part of the map is fogged and unexplored. What is the honest thing to record?',
      options: [
        { id: 'unknown', label: 'That the cost there is unknown', emoji: '❓' },
        { id: 'zero', label: 'That it costs nothing', emoji: '0️⃣' },
        { id: 'huge', label: 'That it is definitely impassable', emoji: '🚫' },
      ],
      answer: 'unknown',
      explanation:
        'Guessing either way would be inventing information. Marking it unknown is what lets you go and find out.',
    },
  ],
};

export const course3Activities: ActivityGame[] = [
  heroBehaviorBuilder,
  guardRuleWorkshop,
  crystalRouteRace,
];
