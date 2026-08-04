#!/usr/bin/env node
/**
 * Renders every route against a real dev server.
 *
 * This exists because of a bug that shipped: `next/image` throws on `fill` plus
 * `width`, but only in development — the check is wrapped in a NODE_ENV guard.
 * `next build`, `next start`, and every production check stayed green while the
 * dev server returned a 500 on the page the user was actually looking at.
 * Production verification alone is not verification.
 *
 * Each route also asserts a marker that only appears if the real component
 * rendered, so a page cannot pass by returning an empty 200.
 *
 * Usage: node scripts/check-pages.mjs
 */
import { startDevServer } from './lib/dev-server.mjs';

const PORT = 3133;
const DIST = '.next-check-pages';

/** [path, a string that proves the page actually rendered] */
const ROUTES = [
  ['/', 'Learn, Create'],
  ['/age-select', 'age group'],
  ['/login', 'Start learning as a guest'],
  ['/dashboard', 'AI for Kids'],
  ['/tutor', 'Sparky'],
  ['/code', 'Code Lab'],
  ['/create', 'Creative Studio'],
  ['/courses', 'AI Courses'],
  ['/courses/ai-detective-academy', 'Missions'],
  ['/courses/ai-detective-academy/picture-clue-patrol', 'Picture Clue Patrol'],
  ['/courses/ai-detective-academy/build-the-picture-detective', 'Chief AI Detective'],
  // A course whose lessons are not transcribed yet must say so, not 404.
  ['/courses/train-your-robot-brain', 'Train Your Robot Brain'],
  ['/stories', 'Stories'],
  ['/stories/the-lantern-that-learned-the-way', 'Lantern'],
  ['/for-parents', 'Parents'],
  ['/privacy', 'Privacy'],
  ['/about', 'About'],
];

let failures = 0;
function report(ok, label, detail = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  -> ${detail}` : ''}`);
}

const server = await startDevServer({ port: PORT, dist: DIST });

try {
  console.log('== every route renders in development ==');
  for (const [path, marker] of ROUTES) {
    const response = await fetch(`${server.base}${path}`);
    const html = await response.text();

    if (response.status !== 200) {
      report(false, path, `HTTP ${response.status}`);
      continue;
    }
    report(html.includes(marker), path, html.includes(marker) ? '' : `missing "${marker}"`);
  }

  // A runtime error in dev is logged even when the page still returns 200.
  const errorLines = server
    .getLog()
    .split('\n')
    .filter((line) => /Error:|⨯/.test(line) && !/Fast Refresh/.test(line));
  report(errorLines.length === 0, 'the dev server logged no errors', errorLines.slice(0, 3).join(' | '));
} finally {
  await server.stop();
}

console.log(`\n${failures === 0 ? '✔ every page renders' : `✖ ${failures} failure(s)`}`);
process.exit(failures === 0 ? 0 : 1);
