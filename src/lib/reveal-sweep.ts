/**
 * The safety net under `Reveal`'s IntersectionObserver.
 *
 * An observer reports *changes* in intersection, and it samples at frame
 * boundaries. Scroll fast enough — a flick on a trackpad, a jump to an anchor,
 * a restored scroll position — and an element can go from "below the viewport"
 * to "above the viewport" between two samples. It never intersected at a moment
 * the browser looked, so no callback ever fires, and that section stays
 * invisible for as long as the page is open. Scrolling back up does not fix it:
 * the element is still not intersecting on the way past.
 *
 * So one shared listener sweeps anything still waiting and reveals whatever the
 * viewport has already gone past. One listener for the whole page rather than
 * one per element, throttled to a frame, and detached the moment nothing is
 * waiting — an idle page pays nothing for it.
 */

/** Only the part of an element this module actually needs. */
export interface Measurable {
  getBoundingClientRect(): { bottom: number };
}

interface Watched {
  element: Measurable;
  reveal: () => void;
}

const pending = new Set<Watched>();
let queued = false;
let listening = false;

/** True once the whole element is above the top of the viewport. */
export function hasScrolledPast(element: Measurable): boolean {
  return element.getBoundingClientRect().bottom <= 0;
}

function sweep() {
  queued = false;

  for (const watched of pending) {
    if (!hasScrolledPast(watched.element)) continue;
    pending.delete(watched);
    watched.reveal();
  }

  if (pending.size === 0) stopListening();
}

function onScroll() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(sweep);
}

function startListening() {
  if (listening || typeof window === 'undefined') return;
  listening = true;
  window.addEventListener('scroll', onScroll, { passive: true });
}

function stopListening() {
  if (!listening || typeof window === 'undefined') return;
  listening = false;
  window.removeEventListener('scroll', onScroll);
}

/**
 * Watches `element` until the viewport has scrolled past it, then calls
 * `reveal` once. Returns an unsubscribe function; call it when the observer
 * wins the race or the component unmounts.
 */
export function watchForOverscroll(element: Measurable, reveal: () => void): () => void {
  const watched: Watched = { element, reveal };
  pending.add(watched);
  startListening();

  return () => {
    pending.delete(watched);
    if (pending.size === 0) stopListening();
  };
}

/** Test seam. */
export function pendingCount(): number {
  return pending.size;
}
