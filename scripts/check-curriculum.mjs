#!/usr/bin/env node
/**
 * Integrity checks on the transcribed course content.
 *
 * The lesson data was parsed out of a Word document rather than typed by hand,
 * which trades typos for a different risk: a silent structural mistake that
 * looks fine until a child hits it. A quiz whose correct answer is not among its
 * options is unanswerable; a lesson missing its badge awards nothing; a pause
 * scene with no reveal leaves a dead button on the page.
 *
 * These are the things that must hold for every lesson of every course, now and
 * as Courses 2-4 are added.
 *
 * Usage: node scripts/check-curriculum.mjs
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { activityGames, findActivityGame } from '../src/data/activities.ts';
import { badges } from '../src/data/badges.ts';
import { courses, courseTotalXp } from '../src/data/courses.ts';
import { lessonVideos } from '../src/data/lesson-videos.ts';
import { formatDuration, lessonTime, parseMinutes, stageTime, videoMinutes } from '../src/lib/lesson-time.ts';

const QUIZ_PASS_MARK = 4;

let failures = 0;
function report(ok, label, detail = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  -> ${detail}` : ''}`);
}

const badgeIds = new Set(badges.map((badge) => badge.id));
const available = courses.filter((course) => course.status === 'available');

console.log('== the catalogue ==');
report(courses.length === 4, 'four courses', `${courses.length}`);
report(available.length > 0, 'at least one course is playable', `${available.length} of 4`);
report(
  new Set(courses.map((c) => c.id)).size === courses.length,
  'course ids are unique',
);
for (const course of courses) {
  report(badgeIds.has(course.badgeId), `${course.id}: course badge exists`, course.badgeId);
}

console.log('\n== every playable course ==');
for (const course of available) {
  report(course.lessons.length === 5, `${course.id}: five lessons`, `${course.lessons.length}`);

  const ids = course.lessons.map((lesson) => lesson.id);
  report(new Set(ids).size === ids.length, `${course.id}: lesson ids are unique`);
  report(
    course.lessons.every((lesson, index) => lesson.number === index + 1),
    `${course.id}: lesson numbers run 1..n in order`,
  );
  report(
    courseTotalXp(course) === course.lessons.reduce((t, l) => t + l.xpReward, 0) + course.completionXp,
    `${course.id}: total XP adds up`,
    `${courseTotalXp(course)}`,
  );
}

console.log('\n== every lesson ==');
for (const course of available) {
  for (const lesson of course.lessons) {
    const where = `${course.id}/${lesson.id}`;
    const problems = [];

    if (!badgeIds.has(lesson.badgeId)) problems.push(`unknown badge ${lesson.badgeId}`);
    if (lesson.xpReward <= 0) problems.push('no XP');
    if (lesson.scenes.length !== 8) problems.push(`${lesson.scenes.length} scenes`);
    if (lesson.objectives.length === 0) problems.push('no objectives');
    if (lesson.vocabulary.length === 0) problems.push('no vocabulary');
    if (lesson.materials.length === 0) problems.push('no materials');
    if (lesson.activity.steps.length === 0) problems.push('activity has no steps');
    if (!lesson.independentMission) problems.push('no independent mission');
    if (!lesson.misconception) problems.push('no misconception');
    if (!lesson.parentSummary) problems.push('no parent summary');

    for (const band of ['explorer', 'builder', 'creator']) {
      if (!lesson.differentiation[band]) problems.push(`no ${band} differentiation`);
    }

    // Every scene must have someone speaking, or the page renders a blank card.
    for (const scene of lesson.scenes) {
      if (scene.turns.length === 0) problems.push(`scene ${scene.id} has no dialogue`);
      if (scene.turns.some((turn) => !turn.text.trim())) problems.push(`scene ${scene.id} has empty text`);
    }

    // A pause scene whose text has no "Welcome back." would render a reveal
    // button with nothing behind it.
    const pauses = lesson.scenes.filter((scene) => scene.isPause);
    if (pauses.length !== 2) problems.push(`${pauses.length} pause scenes`);
    for (const pause of pauses) {
      if (!pause.turns[0]?.text.includes('Welcome back.')) {
        problems.push(`pause scene ${pause.id} has no reveal`);
      }
    }

    report(problems.length === 0, where, problems.join('; '));
  }
}

console.log('\n== every quiz question is answerable ==');
for (const course of available) {
  for (const lesson of course.lessons) {
    const problems = [];

    if (lesson.quiz.length !== 5) problems.push(`${lesson.quiz.length} questions`);
    if (lesson.quiz.length < QUIZ_PASS_MARK) problems.push('cannot reach the pass mark');

    lesson.quiz.forEach((question, index) => {
      const n = index + 1;
      if (!question.question.trim()) problems.push(`Q${n} has no text`);
      if (question.options.length < 2) problems.push(`Q${n} has ${question.options.length} options`);
      if (new Set(question.options).size !== question.options.length) {
        problems.push(`Q${n} has duplicate options`);
      }
      // The one that makes a question unanswerable.
      if (!question.options.includes(question.answer)) {
        problems.push(`Q${n} answer is not among its options`);
      }
      if (!question.explanation.trim()) problems.push(`Q${n} has no explanation`);
    });

    report(problems.length === 0, `${course.id}/${lesson.id}`, problems.join('; '));
  }
}

console.log('\n== no step is a wall of text ==');
{
  // The first version of the lesson page put every scene on one screen and was
  // unreadable for a child. The page now shows one scene at a time, so the
  // guard is per scene — and it measures what a child actually sees, after the
  // video-only instructions are dropped.
  const MAX_WORDS_PER_SCENE = 120;

  const sentences = (text) =>
    (text.match(/[^.!?]+[.!?]+["'’”]*\s*/g) ?? [text]).map((s) => s.trim()).filter(Boolean);
  const onScreen = (text) =>
    sentences(text)
      .filter((s) => !/\bvideo\b|countdown reaches zero|\bpause for up to\b/i.test(s))
      .join(' ');

  for (const course of available) {
    for (const lesson of course.lessons) {
      const heaviest = lesson.scenes
        .map((scene) => ({
          label: scene.label,
          words: scene.turns.map((t) => onScreen(t.text)).join(' ').split(/\s+/).filter(Boolean).length,
        }))
        .sort((a, b) => b.words - a.words)[0];

      report(
        heaviest.words <= MAX_WORDS_PER_SCENE,
        `${course.id}/${lesson.id}`,
        `heaviest step: ${heaviest.label}, ${heaviest.words} words`,
      );
    }
  }

  // A lesson that still says "pause the video" on a page with no video leaves a
  // child waiting for something that never happens.
  for (const course of available) {
    for (const lesson of course.lessons) {
      const stranded = lesson.scenes.filter((scene) =>
        scene.turns.some((turn) => /pause the video/i.test(onScreen(turn.text))),
      );
      report(stranded.length === 0, `${course.id}/${lesson.id}: no leftover video instructions`);
    }
  }
}

console.log('\n== every lesson has a playable activity ==');
{
  for (const course of available) {
    for (const lesson of course.lessons) {
      const game = findActivityGame(course.id, lesson.id);
      report(game !== undefined, `${course.id}/${lesson.id}: has a game`, game ? game.title : 'falls back to instructions');
    }
  }

  for (const game of activityGames) {
    const problems = [];
    if (game.rounds.length < 4) problems.push(`only ${game.rounds.length} rounds`);
    if (!game.intro || !game.outro) problems.push('missing intro or outro');

    const ids = game.rounds.map((round) => round.id);
    if (new Set(ids).size !== ids.length) problems.push('duplicate round ids');

    game.rounds.forEach((round, index) => {
      const n = index + 1;
      const optionIds = round.options.map((option) => option.id);

      // The one that makes a round unwinnable.
      if (!optionIds.includes(round.answer)) problems.push(`round ${n} answer is not an option`);
      if (new Set(optionIds).size !== optionIds.length) problems.push(`round ${n} has duplicate options`);
      if (round.options.length < 2) problems.push(`round ${n} has too few options`);
      if (!round.question.trim()) problems.push(`round ${n} has no question`);
      if (!round.explanation.trim()) problems.push(`round ${n} has no explanation`);
      // A screen reader user gets the label instead of the picture, so it has
      // to describe what is visible without naming the answer.
      if (!round.visual.label?.trim()) problems.push(`round ${n} visual has no label`);
    });

    report(problems.length === 0, game.lessonKey, problems.join('; '));
  }

  // Every game must belong to a lesson that exists.
  for (const game of activityGames) {
    const [courseId, lessonId] = game.lessonKey.split('/');
    const course = courses.find((entry) => entry.id === courseId);
    const lesson = course?.lessons.find((entry) => entry.id === lessonId);
    report(lesson !== undefined, `${game.lessonKey}: points at a real lesson`);
  }
}

console.log('\n== lesson films ==');
{
  // The delivered edit ran 3:08 against a 10:00 script, so the document's
  // timecodes were unusable. These guards catch the same drift next time: a
  // pause set past the end of the file would simply never fire, and nobody
  // would notice until a child sat through the film without being asked to
  // think.
  for (const [key, video] of Object.entries(lessonVideos)) {
    const [courseId, lessonId] = key.split('/');
    const course = courses.find((entry) => entry.id === courseId);
    const lesson = course?.lessons.find((entry) => entry.id === lessonId);
    const problems = [];

    if (!lesson) problems.push('points at a lesson that does not exist');

    const file = join('public', video.src.replace(/^\//, ''));
    if (!existsSync(file)) problems.push(`video file missing: ${file}`);
    const poster = join('public', video.poster.replace(/^\//, ''));
    if (!existsSync(poster)) problems.push(`poster missing: ${poster}`);

    if (video.chapters.length === 0) problems.push('no chapters');
    if (video.chapters[0]?.start !== 0) problems.push('first chapter does not start at 0');

    let previous = -1;
    for (const chapter of video.chapters) {
      if (chapter.start <= previous) problems.push(`chapters out of order at ${chapter.sceneId}`);
      if (chapter.start >= video.durationSeconds) {
        problems.push(`chapter ${chapter.sceneId} starts past the end`);
      }
      if (lesson && !lesson.scenes.some((scene) => scene.id === chapter.sceneId)) {
        problems.push(`chapter ${chapter.sceneId} is not a scene in the lesson`);
      }
      previous = chapter.start;
    }

    // Every scripted pause point must exist in the film, and land inside it.
    const pauseScenes = lesson?.scenes.filter((scene) => scene.isPause) ?? [];
    for (const scene of pauseScenes) {
      const pause = video.pauses.find((entry) => entry.sceneId === scene.id);
      if (!pause) {
        problems.push(`scene ${scene.id} asks the child to pause, but the film never stops`);
        continue;
      }
      if (pause.at <= 0 || pause.at >= video.durationSeconds) {
        problems.push(`pause for ${scene.id} at ${pause.at}s is outside the ${video.durationSeconds}s film`);
      }
    }

    if (!video.captions) {
      console.log(`NOTE  ${key}: no subtitles yet — required before public release`);
    }

    // The document promises "Exactly 10 minutes" and the site was printing it
    // beside a 3:08 film. Every displayed time is now computed from the file, so
    // this asserts the two can never disagree again.
    if (lesson) {
      const shown = stageTime('Lesson video', lesson.components[0]?.time ?? '', video);
      const real = `${videoMinutes(video)} min`;
      if (shown !== real) problems.push(`shows "${shown}" for a ${real} film`);

      const planned = lesson.components[0]?.time ?? '';
      if (parseMinutes(planned)?.min !== videoMinutes(video)) {
        console.log(
          `NOTE  ${key}: script plans ${planned} of video, delivered film is ` +
            `${formatDuration(video.durationSeconds)} — site shows the real length`,
        );
      }
    }

    report(problems.length === 0, `${key}: film wiring`, problems.join('; '));
  }
}

console.log('\n== badges ==');
report(new Set(badges.map((b) => b.id)).size === badges.length, 'badge ids are unique');
report(
  badges.every((badge) => badge.name && badge.description && badge.requirement && badge.emoji),
  'every badge is fully described',
);
const lessonBadgeIds = available.flatMap((c) => c.lessons.map((l) => l.badgeId));
report(
  new Set(lessonBadgeIds).size === lessonBadgeIds.length,
  'no two lessons share a badge',
);

console.log(
  `\n${failures === 0 ? '✔ course content is complete and answerable' : `✖ ${failures} failure(s)`}`,
);
process.exit(failures === 0 ? 0 : 1);
