export type BadgeKind = 'platform' | 'lesson' | 'course';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  /** How the badge is earned, shown on the locked state. */
  requirement: string;
  emoji: string;
  kind: BadgeKind;
}

/** Earned by using the platform rather than by finishing a lesson. */
const platformBadges: BadgeDefinition[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'You started your AI adventure.',
    requirement: 'Choose an age group',
    emoji: '👣',
    kind: 'platform',
  },
  {
    id: 'curious-mind',
    name: 'Curious Mind',
    description: 'You asked Sparky your first question.',
    requirement: 'Send 1 message to Sparky',
    emoji: '💭',
    kind: 'platform',
  },
  {
    id: 'code-starter',
    name: 'Code Starter',
    description: 'You ran your first Python program.',
    requirement: 'Complete 1 Code Lab challenge',
    emoji: '⌨️',
    kind: 'platform',
  },
  {
    id: 'story-weaver',
    name: 'Story Weaver',
    description: 'You created a story with AI.',
    requirement: 'Generate 1 story in Creative Studio',
    emoji: '📖',
    kind: 'platform',
  },
  {
    id: 'quiz-champ',
    name: 'Quiz Champ',
    description: 'You aced a lesson quiz.',
    requirement: 'Score full marks on any quiz',
    emoji: '🏆',
    kind: 'platform',
  },
  {
    id: 'streak-keeper',
    name: 'Streak Keeper',
    description: 'You learned five days in a row.',
    requirement: 'Reach a 5-day streak',
    emoji: '🔥',
    kind: 'platform',
  },
  {
    id: 'super-creator',
    name: 'Super Creator',
    description: 'You used every creative tool.',
    requirement: 'Try Story, Art, and Music makers',
    emoji: '🌟',
    kind: 'platform',
  },
];

/**
 * Curriculum badges, one per lesson, named in the course material.
 *
 * Kept beside the platform badges so the dashboard has a single list to render,
 * but declared separately because these grow with every course transcribed —
 * Course 1 contributes five, and there will be twenty when all four are in.
 */
const lessonBadges: BadgeDefinition[] = [
  {
    id: 'pixel-detective',
    name: 'Pixel Detective',
    description: 'You sorted mystery pictures using visible clues.',
    requirement: 'Finish Picture Clue Patrol',
    emoji: '🔍',
    kind: 'lesson',
  },
  {
    id: 'sound-scout',
    name: 'Sound Scout',
    description: 'You matched mystery sounds to their sources.',
    requirement: 'Finish Sound Safari',
    emoji: '👂',
    kind: 'lesson',
  },
  {
    id: 'source-sleuth',
    name: 'Source Sleuth',
    description: 'You judged whether a person or a machine made something.',
    requirement: 'Finish Human or Machine?',
    emoji: '🕵️',
    kind: 'lesson',
  },
  {
    id: 'glitch-buster',
    name: 'Glitch Buster',
    description: 'You found the cause of three AI failures.',
    requirement: 'Finish Glitch Hunt',
    emoji: '🐞',
    kind: 'lesson',
  },
  {
    id: 'chief-ai-detective',
    name: 'Chief AI Detective',
    description: 'You trained and tested your own picture detective.',
    requirement: 'Finish Build the Picture Detective',
    emoji: '🎖️',
    kind: 'lesson',
  },
];

/**
 * One per course. The course material specifies "one course badge after all
 * missions are completed" without naming them, so each takes its course's name.
 */
const courseBadges: BadgeDefinition[] = [
  {
    id: 'ai-detective-academy',
    name: 'AI Detective Academy',
    description: 'You completed every mission in the Detective Academy.',
    requirement: 'Finish all 5 lessons in AI Detective Academy',
    emoji: '🥇',
    kind: 'course',
  },
  {
    id: 'train-your-robot-brain',
    name: 'Robot Brain Trainer',
    description: 'You completed every mission in Train Your Robot Brain.',
    requirement: 'Finish all 5 lessons in Train Your Robot Brain',
    emoji: '🤖',
    kind: 'course',
  },
  {
    id: 'ai-game-creator-lab',
    name: 'Game Creator',
    description: 'You completed every mission in the Game Creator Lab.',
    requirement: 'Finish all 5 lessons in AI Game Creator Lab',
    emoji: '🎮',
    kind: 'course',
  },
  {
    id: 'superhero-ai-missions',
    name: 'Responsible AI Hero',
    description: 'You completed every Superhero AI mission.',
    requirement: 'Finish all 5 lessons in Superhero AI Missions',
    emoji: '🦸',
    kind: 'course',
  },
];

export const badges: BadgeDefinition[] = [...platformBadges, ...lessonBadges, ...courseBadges];

export function findBadge(badgeId: string): BadgeDefinition | undefined {
  return badges.find((badge) => badge.id === badgeId);
}
