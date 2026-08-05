#!/usr/bin/env node
/**
 * Guards the wiring that made every film after the first appear broken.
 *
 * The files were never the problem: all fourteen decode, serve with 206, and
 * carry identical codecs. The fault was in React.
 *
 * Setting a new `src` on a `<video>` element does **not** load it — the element
 * keeps whatever media it already had until `load()` is called. React reuses
 * the same DOM node when only props change, so navigating between lessons
 * swapped the attribute and left the previous film sitting there. On top of
 * that, the lesson flow kept its step index across lessons, so a child who
 * finished lesson 1 landed on the last step of lesson 2 and never reached the
 * film at all.
 *
 * Three things fixed it, and all three are asserted here because any one of
 * them silently regressing brings the bug back.
 *
 * Usage: node scripts/check-video-wiring.mjs
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { courses } from '../src/data/courses.ts';

let failures = 0;
function report(ok, label, detail = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  -> ${detail}` : ''}`);
}

const player = readFileSync('src/components/courses/lesson-video.tsx', 'utf8');
const view = readFileSync('src/components/courses/lesson-view.tsx', 'utf8');
const route = readFileSync('src/app/(app)/courses/[courseId]/[lessonId]/page.tsx', 'utf8');

console.log('== the wiring ==');
report(
  /useEffect\([\s\S]{0,600}element\.load\(\)[\s\S]{0,200}\[video\.src\]\)/.test(player),
  'the player calls load() when the film changes',
  'without this a new src keeps the old media',
);
report(
  /reported\.current = false/.test(player) && /setStarted\(false\)/.test(player),
  'the player resets its state for a new film',
);
report(
  /<LessonVideoPlayer\s+key=\{lesson\.video\.src\}/.test(view),
  'the player is keyed on the film',
);
report(
  /<LessonView\s+key=\{`\$\{params\.courseId\}\/\$\{params\.lessonId\}`\}/.test(route),
  'the lesson flow is keyed on the lesson',
  'without this the step index carries over between lessons',
);

console.log('\n== every film is real and playable ==');
for (const course of courses) {
  for (const lesson of course.lessons) {
    const file = join('public', lesson.video.src.replace(/^\//, ''));
    const problems = [];

    if (!existsSync(file)) {
      problems.push('missing');
    } else {
      if (statSync(file).size < 100_000) problems.push('suspiciously small');

      try {
        // Decoding the whole file catches truncation, which reading the header
        // does not — a broken file still reports its duration quite happily.
        execFileSync('ffmpeg', ['-nostdin', '-v', 'error', '-i', file, '-f', 'null', '-'], {
          stdio: ['ignore', 'ignore', 'pipe'],
        });
      } catch (error) {
        problems.push(`does not decode: ${String(error).slice(0, 80)}`);
      }

      const probe = execFileSync(
        'ffprobe',
        ['-v', 'error', '-show_entries', 'stream=codec_name', '-of', 'csv=p=0', file],
        { encoding: 'utf8' },
      );
      // Anything a browser cannot play is a file that looks fine to us and
      // blank to a child.
      if (!probe.includes('h264')) problems.push('video is not H.264');
      if (!probe.includes('aac')) problems.push('audio is not AAC');
    }

    report(problems.length === 0, `${course.id}/${lesson.id}`, problems.join('; '));
  }
}

console.log(`\n${failures === 0 ? '✔ every film is wired up and playable' : `✖ ${failures} failure(s)`}`);
process.exit(failures === 0 ? 0 : 1);
