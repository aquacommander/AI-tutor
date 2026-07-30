#!/usr/bin/env node
/**
 * Fixtures for the reveal-on-scroll safety net.
 *
 * This guards a bug that already shipped once and is invisible in every
 * screenshot: scroll past a section fast enough and IntersectionObserver never
 * samples it in view, so it stays permanently blank. The observer itself cannot
 * be tested without a browser, but the sweep that rescues those elements is
 * plain logic, so it can be.
 *
 * Usage: node scripts/check-reveal.mjs
 */

let failures = 0;
function report(ok, label, detail = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  -> ${detail}` : ''}`);
}

// --- a browser, roughly -----------------------------------------------------

const listeners = new Map();
let frames = [];

globalThis.window = {
  addEventListener(type, handler) {
    listeners.set(type, [...(listeners.get(type) ?? []), handler]);
  },
  removeEventListener(type, handler) {
    listeners.set(type, (listeners.get(type) ?? []).filter((h) => h !== handler));
  },
};
globalThis.requestAnimationFrame = (callback) => {
  frames.push(callback);
  return frames.length;
};

const scrollHandlers = () => listeners.get('scroll') ?? [];
const fireScroll = () => scrollHandlers().forEach((handler) => handler());
const nextFrame = () => {
  const queued = frames;
  frames = [];
  queued.forEach((callback) => callback());
};

const element = (bottom) => ({ getBoundingClientRect: () => ({ bottom }) });
/** An element whose position can be moved between samples. */
const movable = (bottom) => {
  const box = { bottom };
  return { box, getBoundingClientRect: () => ({ bottom: box.bottom }) };
};

const { watchForOverscroll, hasScrolledPast, pendingCount } = await import(
  '../src/lib/reveal-sweep.ts'
);

// --- the bug ----------------------------------------------------------------

console.log('== an element scrolled clean past still gets revealed ==');
{
  const target = movable(900); // Below the fold at mount.
  let revealed = false;
  watchForOverscroll(target, () => (revealed = true));

  fireScroll();
  nextFrame();
  report(!revealed, 'stays hidden while it is still below the viewport');

  // The jump the observer misses: below the fold, then above it, with no
  // sample in between.
  target.box.bottom = -120;
  fireScroll();
  nextFrame();
  report(revealed, 'revealed once the viewport has gone past it');
  report(pendingCount() === 0, 'stops being watched afterwards');
  report(scrollHandlers().length === 0, 'the shared listener detaches when nothing is waiting');
}

console.log('\n== the listener is shared, not one per element ==');
{
  const targets = Array.from({ length: 8 }, () => movable(900));
  const unwatchers = targets.map((target) => watchForOverscroll(target, () => {}));

  report(scrollHandlers().length === 1, 'one scroll listener for eight elements', `${scrollHandlers().length}`);
  report(pendingCount() === 8, 'all eight are waiting');

  unwatchers.forEach((unwatch) => unwatch());
  report(pendingCount() === 0, 'unwatching clears them');
  report(scrollHandlers().length === 0, 'and detaches the listener');
}

console.log('\n== scrolling is throttled to one sweep per frame ==');
{
  const target = movable(900);
  const unwatch = watchForOverscroll(target, () => {});

  frames = [];
  for (let i = 0; i < 20; i++) fireScroll();
  report(frames.length === 1, 'twenty scroll events queue one sweep', `${frames.length}`);

  nextFrame();
  for (let i = 0; i < 3; i++) fireScroll();
  report(frames.length === 1, 'and the next burst queues one more', `${frames.length}`);

  frames = [];
  unwatch();
}

console.log('\n== hasScrolledPast ==');
{
  report(hasScrolledPast(element(-1)) === true, 'above the viewport counts as passed');
  report(hasScrolledPast(element(0)) === true, 'exactly at the top counts as passed');
  report(hasScrolledPast(element(1)) === false, 'still one pixel on screen does not');
}

console.log(`\n${failures === 0 ? '✔ nothing gets stranded' : `✖ ${failures} failure(s)`}`);
process.exit(failures === 0 ? 0 : 1);
