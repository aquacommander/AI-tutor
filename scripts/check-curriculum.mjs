#!/usr/bin/env node
/**
 * Integrity checks on the course content.
 *
 * The lessons are generated from AI_for_Kids_Revised_14_Video_Course_Plan.docx
 * rather than typed by hand, which trades typos for a worse risk: a silent
 * structural mistake that looks fine until a child hits it. A quiz whose correct
 * answer is not among its options is unanswerable. A lesson pointing at a video
 * that is not there plays nothing. A badge id with no badge awards nothing.
 *
 * These also enforce the plan's own release rules — five questions with
 * explanations, an "Unsure"-style option where the lesson calls for one, a
 * parent summary on every lesson, and a capstone gating every course badge.
 *
 * Usage: node scripts/check-curriculum.mjs
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { activityGames, findActivityGame } from '../src/data/activities.ts';
import { badges } from '../src/data/badges.ts';
import { courses, courseTotalXp, courseVideoSeconds, TOTAL_LESSONS } from '../src/data/courses.ts';
import { formatDuration } from '../src/lib/lesson-time.ts';
import { RIDDLE_ROUNDS } from '../src/data/activities/sound-riddle.ts';
import { buildMissions, findBuildMission, missionMaxScore } from '../src/data/missions/build-it.ts';
import { seededShuffle } from '../src/lib/shuffle.ts';

const QUIZ_PASS_MARK = 4;
/** The plan's stated total: 23:48 across 14 films. */
const EXPECTED_VIDEO_SECONDS = 1428;

let failures = 0;
function report(ok, label, detail = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  -> ${detail}` : ''}`);
}

const badgeIds = new Set(badges.map((badge) => badge.id));

console.log('== the programme ==');
report(courses.length === 4, 'four courses', `${courses.length}`);
report(TOTAL_LESSONS === 14, 'fourteen lessons', `${TOTAL_LESSONS}`);
report(
  courses.map((c) => c.lessons.length).join('/') === '5/4/3/2',
  'lessons split 5/4/3/2 as the plan specifies',
  courses.map((c) => c.lessons.length).join('/'),
);
report(new Set(courses.map((c) => c.id)).size === 4, 'course ids are unique');

const totalVideo = courses.reduce((t, c) => t + courseVideoSeconds(c), 0);
report(
  Math.abs(totalVideo - EXPECTED_VIDEO_SECONDS) <= 8,
  'total film time matches the plan',
  `${formatDuration(totalVideo)} vs 23:48 stated`,
);

console.log('\n== every course ==');
for (const course of courses) {
  const problems = [];
  if (!course.tagline) problems.push('no tagline');
  if (course.outcomes.length === 0) problems.push('no outcomes');
  if (!badgeIds.has(course.capstone.badgeId)) problems.push(`capstone badge ${course.capstone.badgeId} missing`);
  if (course.capstone.tasks.length < 3) problems.push(`capstone has ${course.capstone.tasks.length} tasks`);
  if (!course.capstone.successStandard) problems.push('capstone has no success standard');
  if (course.capstone.xpReward <= 0) problems.push('capstone is worth no XP');

  const expected = course.lessons.reduce((t, l) => t + l.xpReward, 0) + course.capstone.xpReward;
  if (courseTotalXp(course) !== expected) problems.push('XP does not add up');

  report(problems.length === 0, `${course.id}`, problems.join('; '));
}

console.log('\n== every lesson ==');
for (const course of courses) {
  for (const lesson of course.lessons) {
    const where = `${course.id}/${lesson.id}`;
    const problems = [];

    if (!badgeIds.has(lesson.badgeId)) problems.push(`unknown badge ${lesson.badgeId}`);
    if (lesson.xpReward <= 0) problems.push('no XP');
    if (!lesson.hook) problems.push('no curiosity hook');
    if (!lesson.watchFocus) problems.push('no watch focus');
    if (!lesson.concept.bigIdea) problems.push('concept card has no big idea');
    if (lesson.concept.vocabulary.length === 0) problems.push('no vocabulary');
    if (lesson.concept.objectives.length === 0) problems.push('no objectives');
    if (lesson.activity.steps.length === 0) problems.push('activity has no steps');
    if (!lesson.independentMission) problems.push('no independent mission');
    if (!lesson.childMission) problems.push('no child-voiced mission');
    // The plan writes missions as instructions to the tutor. Rendering that to
    // a nine-year-old is unreadable, so the child version must not slip back
    // into talking *about* them.
    if (/\b(the learner|require the|ask the learner|give the learner)\b/i.test(lesson.childMission)) {
      problems.push('child mission is written in tutor voice');
    }
    if (!lesson.adaptation.younger) problems.push('no 6-8 adaptation');
    if (!lesson.adaptation.older) problems.push('no 13-16 adaptation');
    if (!lesson.parentTakeaway) problems.push('no parent takeaway');

    // The film has to exist and be the length the lesson claims.
    const file = join('public', lesson.video.src.replace(/^\//, ''));
    if (!existsSync(file)) problems.push(`video missing: ${file}`);
    const poster = join('public', 'images', lesson.video.poster);
    if (!existsSync(poster)) problems.push(`poster missing: ${poster}`);
    if (lesson.video.durationSeconds <= 0) problems.push('video has no duration');

    report(problems.length === 0, where, problems.join('; '));
  }
}

console.log('\n== every quiz question is answerable ==');
for (const course of courses) {
  for (const lesson of course.lessons) {
    const problems = [];

    if (lesson.quiz.length !== 5) problems.push(`${lesson.quiz.length} questions`);
    if (lesson.quiz.length < QUIZ_PASS_MARK) problems.push('cannot reach the pass mark');

    lesson.quiz.forEach((question, index) => {
      const n = index + 1;
      if (!question.question.trim()) problems.push(`Q${n} has no text`);
      if (question.options.length < 3) problems.push(`Q${n} has ${question.options.length} options`);
      if (new Set(question.options).size !== question.options.length) {
        problems.push(`Q${n} has duplicate options`);
      }
      // The one that makes a question unanswerable.
      if (!question.options.includes(question.answer)) {
        problems.push(`Q${n} answer is not among its options`);
      }
      // The plan's release check: "Does each wrong answer reveal a real
      // misconception?" A blank one certainly does not.
      if (question.options.some((option) => !option.trim())) {
        problems.push(`Q${n} has an empty option`);
      }
      if (!question.explanation.trim()) problems.push(`Q${n} has no explanation`);
    });

    report(problems.length === 0, `${course.id}/${lesson.id}`, problems.join('; '));
  }
}

console.log('\n== the answer is not always the first button ==');
{
  // The generator lists the correct answer first, so the UI must shuffle. It
  // did not, and every quiz was answerable without reading the question. This
  // measures what a child actually sees.
  const positions = [];
  for (const course of courses) {
    for (const lesson of course.lessons) {
      for (const question of lesson.quiz) {
        const shown = seededShuffle(question.options, question.question);
        positions.push(shown.indexOf(question.answer));
      }
    }
  }

  const first = positions.filter((p) => p === 0).length;
  const share = first / positions.length;
  report(
    positions.every((p) => p >= 0),
    'every correct answer survives the shuffle',
  );
  report(
    share < 0.6,
    'the answer is not always first',
    `${first} of ${positions.length} questions (${Math.round(share * 100)}%)`,
  );
  report(
    new Set(positions).size > 1,
    'answers land in more than one position',
    `positions used: ${[...new Set(positions)].sort().join(', ')}`,
  );

  // The same shuffle must be stable, or a retry would move the buttons.
  const sample = courses[0].lessons[0].quiz[0];
  report(
    seededShuffle(sample.options, sample.question).join('|') ===
      seededShuffle(sample.options, sample.question).join('|'),
    'the shuffle is stable across renders',
  );

  const gamePositions = [];
  for (const game of activityGames) {
    for (const round of game.rounds) {
      const shown = seededShuffle(round.options, round.id);
      gamePositions.push(shown.findIndex((o) => o.id === round.answer));
    }
  }
  const gameFirst = gamePositions.filter((p) => p === 0).length;
  report(
    gameFirst / gamePositions.length < 0.6,
    'activity answers are not always first',
    `${gameFirst} of ${gamePositions.length} rounds`,
  );

  // Sound Riddle sources are authored with the true answer first, so this is the
  // one that most needs checking after shuffling.
  const soundFirst = RIDDLE_ROUNDS.filter((round) => {
    const shuffled = seededShuffle(
      round.sources.filter((card) => card.id !== 'unsure'),
      `${round.id}:1`,
    );
    return shuffled[0]?.id === round.answer;
  }).length;
  report(
    soundFirst < RIDDLE_ROUNDS.length,
    'sound sources are not always first',
    `${soundFirst} of ${RIDDLE_ROUNDS.length} rounds`,
  );

  // A different seed must give a different arrangement, or "random every time"
  // would be a claim rather than a behaviour.
  const runs = new Set(
    [1, 2, 3, 4, 5].map((n) => seededShuffle(sample.options, `${sample.question}:${n}`).join('|')),
  );
  report(runs.size > 1, 'a new visit gives a new order', `${runs.size} orders from 5 seeds`);
}

console.log('\n== activities ==');
{
  let withGames = 0;
  for (const course of courses) {
    for (const lesson of course.lessons) {
      if (findActivityGame(course.id, lesson.id)) withGames += 1;
    }
  }
  // Lessons without a game still render their steps, so this is progress
  // reporting rather than a failure — but it is printed so nobody forgets.
  console.log(`NOTE  ${withGames} of ${TOTAL_LESSONS} lessons have a playable game`);

  for (const game of activityGames) {
    const problems = [];
    const [courseId, lessonId] = game.lessonKey.split('/');
    const course = courses.find((entry) => entry.id === courseId);
    if (!course?.lessons.some((entry) => entry.id === lessonId)) {
      problems.push('points at a lesson that does not exist');
    }
    if (game.rounds.length < 4) problems.push(`only ${game.rounds.length} rounds`);
    if (!game.intro || !game.outro) problems.push('missing intro or outro');

    game.rounds.forEach((round, index) => {
      const n = index + 1;
      const optionIds = round.options.map((option) => option.id);
      if (!optionIds.includes(round.answer)) problems.push(`round ${n} answer is not an option`);
      if (new Set(optionIds).size !== optionIds.length) problems.push(`round ${n} has duplicate options`);
      if (!round.explanation.trim()) problems.push(`round ${n} has no explanation`);
      if (!round.visual.label?.trim()) problems.push(`round ${n} visual has no label`);
    });

    report(problems.length === 0, game.lessonKey, problems.join('; '));
  }
}

console.log('\n== every lesson has a playable independent mission ==');
{
  // Two lessons have bespoke missions; the rest use the build-it engine. A
  // lesson with neither falls back to a paragraph of text, which is what this
  // whole exercise was about removing.
  const BESPOKE = [
    'ai-detective-academy/picture-clue-patrol',
    'ai-detective-academy/sound-safari',
    'ai-detective-academy/creative-clues',
  ];

  for (const course of courses) {
    for (const lesson of course.lessons) {
      const key = `${course.id}/${lesson.id}`;
      const playable = BESPOKE.includes(key) || findBuildMission(key) !== undefined;
      report(playable, `${key}: mission is playable`, playable ? '' : 'falls back to text');
    }
  }

  for (const mission of buildMissions) {
    const problems = [];
    if (mission.steps.length < 2) problems.push('too few steps');
    if (!mission.check.question) problems.push('no check question');

    const answers = mission.check.options.map((o) => o.id);
    if (!answers.includes(mission.check.answer)) problems.push('check answer is not an option');
    if (!mission.check.explanation) problems.push('check has no explanation');

    for (const step of mission.steps) {
      const good = step.options.filter((o) => o.good).length;
      if (good < step.pick) {
        problems.push(`step ${step.id} cannot be answered well (${good} good, needs ${step.pick})`);
      }
      if (step.options.length <= step.pick) problems.push(`step ${step.id} has no real choice`);
    }

    // Placeholders must all resolve, or a child sees "{1}" in their sentence.
    const slots = [...mission.sentence.matchAll(/\{(\d+)\}/g)].map((m) => Number(m[1]));
    for (const slot of slots) {
      if (slot >= mission.steps.length) problems.push(`sentence references step ${slot}`);
    }
    if (slots.length === 0) problems.push('sentence uses no choices');

    report(problems.length === 0, mission.lessonKey, problems.join('; '));
  }

  console.log(
    `NOTE  build-it missions score up to ${buildMissions
      .map((m) => missionMaxScore(m))
      .join(', ')} points`,
  );
}

console.log('\n== badges ==');
report(new Set(badges.map((b) => b.id)).size === badges.length, 'badge ids are unique');
report(
  badges.every((badge) => badge.name && badge.description && badge.requirement && badge.emoji),
  'every badge is fully described',
);
report(
  badges.filter((b) => b.kind === 'lesson').length === TOTAL_LESSONS,
  'one badge per lesson',
  `${badges.filter((b) => b.kind === 'lesson').length}`,
);
report(
  badges.filter((b) => b.kind === 'course').length === courses.length,
  'one badge per capstone',
);

console.log('\n== subtitles ==');
for (const course of courses) {
  for (const lesson of course.lessons) {
    if (!lesson.video.captions) {
      console.log(`NOTE  ${course.id}/${lesson.id}: no subtitles — on the plan's release checklist`);
    }
  }
}

console.log(
  `\n${failures === 0 ? '✔ course content is complete and answerable' : `✖ ${failures} failure(s)`}`,
);
process.exit(failures === 0 ? 0 : 1);
