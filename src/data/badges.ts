import { courses } from './courses.ts';

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
    description: 'You wrote your first Python program.',
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
    description: 'You answered every question correctly.',
    requirement: 'Score full marks on any quiz',
    emoji: '🏆',
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
  {
    id: 'two-clue-detective-star',
    name: 'Two-Clue Detective Star',
    description: 'You named animals and backed every answer with two clues.',
    requirement: 'Score 210 in the Two-Clue Animal Challenge',
    emoji: '⭐',
    kind: 'platform',
  },
  {
    id: 'sound-detective',
    name: 'Sound Detective',
    description: 'You solved sound mysteries using pitch, rhythm and volume.',
    requirement: 'Score 420 in the Sound Riddle Challenge',
    emoji: '🎧',
    kind: 'platform',
  },
  {
    id: 'evidence-investigator',
    name: 'Evidence Investigator',
    description: 'You judged what made things — without ever claiming more than the evidence proved.',
    requirement: 'Score 420 in the AI Evidence Investigator',
    emoji: '🕵️',
    kind: 'platform',
  },
  {
    id: 'graduate',
    name: 'AI for Kids Graduate',
    description: 'You finished every course and every capstone.',
    requirement: 'Complete all four capstone projects',
    emoji: '🎓',
    kind: 'platform',
  },
];

/**
 * One badge per lesson and one per capstone, generated from the courses so a new
 * lesson can never arrive without a badge to award.
 *
 * The capstone badge names come from the course plan; the lesson badges take the
 * lesson's own title, which keeps them meaningful without inventing new names
 * the tutor has not seen.
 */
const LESSON_EMOJI: Record<string, string> = {
  'picture-clue-patrol': '🔍',
  'sound-safari': '👂',
  'creative-clues': '🕵️',
  'glitch-hunt': '🐞',
  'ai-detective': '🎖️',
  'feature-find': '🧭',
  'data-kitchen': '🥕',
  'mood-mixer': '💬',
  'robot-brain': '🤖',
  'game-hero': '🎮',
  'choice-engine': '🔀',
  'maze-mission': '🗺️',
  'privacy-mission': '🛡️',
  'truth-tracker': '📰',
};

const CAPSTONE_EMOJI: Record<string, string> = {
  'chief-ai-detective': '🥇',
  'robot-brain-champion': '🏅',
  'junior-game-architect': '🎯',
  'smart-and-safe-ai-hero': '🦸',
};

const lessonBadges: BadgeDefinition[] = courses.flatMap((course) =>
  course.lessons.map((lesson) => ({
    id: lesson.badgeId,
    name: lesson.title.split(':')[0] ?? lesson.title,
    description: `You completed ${lesson.title}.`,
    requirement: `Pass the quiz for lesson ${lesson.number} of ${course.title}`,
    emoji: LESSON_EMOJI[lesson.id] ?? '⭐',
    kind: 'lesson' as const,
  })),
);

const capstoneBadges: BadgeDefinition[] = courses.map((course) => ({
  id: course.capstone.badgeId,
  // Turns "chief-ai-detective" back into the plan's "Chief AI Detective".
  name: course.capstone.badgeId
    .split('-')
    .map((word) => (word === 'ai' ? 'AI' : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' '),
  description: `You finished the ${course.capstone.title}.`,
  requirement: `Complete the ${course.capstone.title} capstone`,
  emoji: CAPSTONE_EMOJI[course.capstone.badgeId] ?? '🏅',
  kind: 'course' as const,
}));

export const badges: BadgeDefinition[] = [...platformBadges, ...lessonBadges, ...capstoneBadges];

export function findBadge(badgeId: string): BadgeDefinition | undefined {
  return badges.find((badge) => badge.id === badgeId);
}
