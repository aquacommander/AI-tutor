import { course1Activities } from './activities/course-1.ts';
import { course2Activities } from './activities/course-2.ts';
import { course3Activities } from './activities/course-3.ts';
import { course4Activities } from './activities/course-4.ts';
import type { ActivityGame } from '@/types/activity';

/**
 * Every lesson's guided activity, as something a child plays.
 *
 * The course plan promises "14 guided activities" and describes them as
 * classroom tasks with printed cards. On screen those became games: one thing at
 * a time, tap an answer, find out straight away whether it worked and why. The
 * printed-card version stays available in the grown-ups panel for anyone running
 * a lesson away from a screen.
 *
 * Split per course because fourteen games in one file is a file nobody opens.
 */
export const activityGames: ActivityGame[] = [
  ...course1Activities,
  ...course2Activities,
  ...course3Activities,
  ...course4Activities,
];

export function findActivityGame(courseId: string, lessonId: string): ActivityGame | undefined {
  return activityGames.find((game) => game.lessonKey === `${courseId}/${lessonId}`);
}

export type {
  ActivityGame,
  GameRound,
  RoundOption,
  RoundVisual,
  Treatment,
} from '@/types/activity';
