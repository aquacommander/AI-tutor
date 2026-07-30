#!/usr/bin/env node
/**
 * Proves the Anthropic key — and everything that could leak it — stays on the
 * server.
 *
 * Builds for production with a sentinel key in the environment, then reads
 * every byte the browser would download and asserts the sentinel is not among
 * them. `server-only` already fails the build if a client component imports the
 * provider seam; this catches the ways that guard can be worked around, such as
 * someone renaming the variable to NEXT_PUBLIC_ANTHROPIC_API_KEY because "it
 * wasn't working".
 *
 * The system prompt is checked too. It is not a secret, but a guardrail sitting
 * in a client chunk is a guardrail anyone can read and plan around.
 *
 * Usage:
 *   node scripts/check-bundle.mjs              build and scan
 *   node scripts/check-bundle.mjs --self-test  prove the scanner catches a leak
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const DIST = '.next-bundle-check';
const SENTINEL = 'sk-ant-SENTINEL-must-never-reach-the-browser-0000';
const PROMPT_MARKER = 'You are Sparky, a friendly robot tutor';

/** Things that must never appear in anything the browser downloads. */
const FORBIDDEN = [
  [SENTINEL, 'the API key itself'],
  // Broader than the sentinel: catches a real key from a developer's
  // .env.local as well as the one this script plants.
  ['sk-ant-', 'anything shaped like an Anthropic key'],
  ['ANTHROPIC_API_KEY', 'the name of the key variable'],
  ['api.anthropic.com', 'the Anthropic SDK'],
  [PROMPT_MARKER, 'the system prompt'],
];

let failures = 0;
function report(ok, label, detail = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  -> ${detail}` : ''}`);
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

/** Returns, for each forbidden string, the client files containing it. */
function scanClientAssets(distDir) {
  const files = walk(join(distDir, 'static'));
  const hits = new Map(FORBIDDEN.map(([needle]) => [needle, []]));

  for (const file of files) {
    const contents = readFileSync(file, 'utf8');
    for (const [needle] of FORBIDDEN) {
      if (contents.includes(needle)) hits.get(needle).push(file);
    }
  }

  return { files, hits };
}

// --- self test --------------------------------------------------------------

/**
 * A scanner nobody has watched fail is not evidence of anything. This plants
 * each forbidden string in a fake build and checks the scan finds it.
 *
 * Temp fixtures only — never the real source tree. Editing `src/` to prove a
 * point once left a dev server serving a stale module for several minutes.
 */
if (process.argv.includes('--self-test')) {
  const fixture = mkdtempSync(join(tmpdir(), 'bundle-scan-'));
  try {
    mkdirSync(join(fixture, 'static', 'chunks'), { recursive: true });

    writeFileSync(join(fixture, 'static', 'chunks', 'clean.js'), 'console.log("hello")\n');
    const { hits: clean } = scanClientAssets(fixture);
    report(
      FORBIDDEN.every(([needle]) => clean.get(needle).length === 0),
      'a clean bundle reports nothing',
    );

    for (const [needle, description] of FORBIDDEN) {
      const leak = join(fixture, 'static', 'chunks', 'leak.js');
      writeFileSync(leak, `const x = ${JSON.stringify(needle)};\n`);
      const { hits } = scanClientAssets(fixture);
      report(hits.get(needle).length === 1, `detects ${description} in a client chunk`);
      rmSync(leak);
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }

  console.log(`\n${failures === 0 ? '✔ the scanner catches what it claims to' : `✖ ${failures} failure(s)`}`);
  process.exit(failures === 0 ? 0 : 1);
}

// --- the real check ---------------------------------------------------------

console.log('building for production with a sentinel key…');
try {
  execFileSync('npx', ['next', 'build'], {
    env: { ...process.env, NEXT_DIST_DIR: DIST, ANTHROPIC_API_KEY: SENTINEL },
    stdio: 'inherit',
  });
} catch {
  console.error('\n✖ production build failed');
  rmSync(DIST, { recursive: true, force: true });
  process.exit(1);
}

try {
  const { files, hits } = scanClientAssets(DIST);
  report(files.length > 0, 'found client assets to scan', `${files.length} files`);

  for (const [needle, description] of FORBIDDEN) {
    const found = hits.get(needle);
    report(found.length === 0, `client bundle contains no ${description}`, found.slice(0, 3).join(', '));
  }

  // A scan that found nothing because it scanned the wrong thing is worse than
  // no scan, so confirm the server build really does hold the route.
  const serverFiles = walk(join(DIST, 'server'));
  const hasRoute = serverFiles.some((file) => file.includes(join('api', 'ai-tutor')));
  report(hasRoute, 'the ai-tutor route was actually built', hasRoute ? '' : 'nothing to protect?');

  const serverHasPrompt = serverFiles.some(
    (file) => file.endsWith('.js') && readFileSync(file, 'utf8').includes(PROMPT_MARKER),
  );
  report(serverHasPrompt, 'the system prompt is present server-side', serverHasPrompt ? '' : 'scan missed it');
} finally {
  rmSync(DIST, { recursive: true, force: true });
}

console.log(`\n${failures === 0 ? '✔ nothing secret reaches the browser' : `✖ ${failures} failure(s)`}`);
process.exit(failures === 0 ? 0 : 1);
