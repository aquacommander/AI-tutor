// Explicit `.ts` so Node can resolve this when the fixture scripts import the
// catalogue directly; webpack and TypeScript both accept it.
import { aiDetectiveAcademy } from './courses/ai-detective-academy.ts';
import type { Course, CourseSummary } from '@/types/course';

/**
 * The four launch tracks, from AI_for_Kids_Complete_Course_Material.docx.
 *
 * Course 1 carries its full lesson content. Courses 2-4 are declared with their
 * real titles, taglines and outcomes so the library shows the whole programme,
 * but are marked `coming-soon` until their lessons are transcribed — a card
 * that opens onto nothing is worse than one that says "not yet".
 */

const trainYourRobotBrain: Course = {
  id: 'train-your-robot-brain',
  title: 'Train Your Robot Brain',
  tagline: 'Teach Pip with examples, improve the data, and discover how machine learning works.',
  outcomes: [
    'Describe training examples, labels, features and predictions in child-friendly language.',
    'Sort examples consistently and identify ambiguous cases.',
    'Recognize that data quality and balance affect results.',
    'Use a train-test-improve cycle to make a simple model better.',
  ],
  lessons: [],
  badgeId: 'train-your-robot-brain',
  completionXp: 100,
  difficulty: 'beginner',
  topics: ['Machine Learning', 'Data'],
  image: 'courses/data-science.webp',
  accent: 'blue',
  status: 'coming-soon',
};

const aiGameCreatorLab: Course = {
  id: 'ai-game-creator-lab',
  title: 'AI Game Creator Lab',
  tagline:
    'Design characters, choices, mazes and stories while learning how intelligent games are built.',
  outcomes: [
    'Break a game into inputs, rules, states, actions and feedback.',
    'Create decision rules and explain how changing a rule changes behavior.',
    'Plan and test a simple pathfinding strategy.',
    'Build and improve a small interactive game or story prototype.',
  ],
  lessons: [],
  badgeId: 'ai-game-creator-lab',
  completionXp: 100,
  difficulty: 'intermediate',
  topics: ['Games', 'Logic'],
  image: 'courses/game-robotics.webp',
  accent: 'orange',
  status: 'coming-soon',
};

const superheroAiMissions: Course = {
  id: 'superhero-ai-missions',
  title: 'Superhero AI Missions',
  tagline:
    'Use AI responsibly to help people while protecting fairness, truth, privacy and human choice.',
  outcomes: [
    'Make age-appropriate decisions about fairness, privacy, safety and reliability.',
    'Explain why important AI decisions need human checking and responsibility.',
    'Verify information using more than one trustworthy clue.',
    'Design a responsible AI solution and explain its safeguards.',
  ],
  lessons: [],
  badgeId: 'superhero-ai-missions',
  completionXp: 100,
  difficulty: 'advanced',
  topics: ['Ethics', 'Safety'],
  image: 'courses/vision-nlp.webp',
  accent: 'green',
  status: 'coming-soon',
};

export const courses: Course[] = [
  aiDetectiveAcademy,
  trainYourRobotBrain,
  aiGameCreatorLab,
  superheroAiMissions,
];

/** Lessons each course will have once written, for the "5 lessons" label. */
const PLANNED_LESSONS = 5;

export function findCourse(courseId: string): Course | undefined {
  return courses.find((course) => course.id === courseId);
}

export function findLesson(courseId: string, lessonId: string) {
  const course = findCourse(courseId);
  const lesson = course?.lessons.find((entry) => entry.id === lessonId);
  if (!course || !lesson) return undefined;

  // Neighbours are derived here rather than in the page, so previous/next can
  // never disagree with the sidebar about the running order.
  const index = course.lessons.indexOf(lesson);
  return {
    course,
    lesson,
    previous: course.lessons[index - 1],
    next: course.lessons[index + 1],
  };
}

/** Every lesson's XP plus the completion bonus. */
export function courseTotalXp(course: Course): number {
  const lessonXp = course.lessons.reduce((total, lesson) => total + lesson.xpReward, 0);
  return (lessonXp || PLANNED_LESSONS * 60) + course.completionXp;
}

/** Card-sized view, derived so the library and the catalogue cannot drift. */
export const courseSummaries: CourseSummary[] = courses.map((course) => ({
  id: course.id,
  title: course.title,
  description: course.tagline,
  lessonCount: course.lessons.length || PLANNED_LESSONS,
  totalXp: courseTotalXp(course),
  difficulty: course.difficulty,
  topics: course.topics,
  image: course.image,
  accent: course.accent,
  status: course.status,
}));

/** Rendered as non-interactive "Coming soon" chips (PRD section 4.6). */
export const upcomingCourses = [
  'Generative AI',
  'Prompt Engineering',
  'AI in Science',
  'Web Dev with AI',
] as const;
