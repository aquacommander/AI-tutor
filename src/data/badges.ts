export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  /** How the badge is earned, shown on the locked state. */
  requirement: string;
  emoji: string;
}

/** The eight launch badges (PRD section 4.7). */
export const badges: BadgeDefinition[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'You started your AI adventure.',
    requirement: 'Choose an age group',
    emoji: '👣',
  },
  {
    id: 'curious-mind',
    name: 'Curious Mind',
    description: 'You asked Sparky your first question.',
    requirement: 'Send 1 message to Sparky',
    emoji: '💭',
  },
  {
    id: 'code-starter',
    name: 'Code Starter',
    description: 'You ran your first Python program.',
    requirement: 'Complete 1 Code Lab challenge',
    emoji: '⌨️',
  },
  {
    id: 'story-weaver',
    name: 'Story Weaver',
    description: 'You created a story with AI.',
    requirement: 'Generate 1 story in Creative Studio',
    emoji: '📖',
  },
  {
    id: 'quiz-champ',
    name: 'Quiz Champ',
    description: 'You aced a lesson quiz.',
    requirement: 'Score full marks on any quiz',
    emoji: '🏆',
  },
  {
    id: 'streak-keeper',
    name: 'Streak Keeper',
    description: 'You learned five days in a row.',
    requirement: 'Reach a 5-day streak',
    emoji: '🔥',
  },
  {
    id: 'course-finisher',
    name: 'Course Finisher',
    description: 'You completed a whole course.',
    requirement: 'Finish all 5 lessons in a course',
    emoji: '🎓',
  },
  {
    id: 'super-creator',
    name: 'Super Creator',
    description: 'You used every creative tool.',
    requirement: 'Try Story, Art, and Music makers',
    emoji: '🌟',
  },
];
