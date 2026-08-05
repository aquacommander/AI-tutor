/**
 * Deterministic shuffling, for answer options.
 *
 * The course data lists the correct answer first — that is how the generator
 * builds it from the plan, which gives one right answer and a set of authored
 * distractors. Rendered in that order, every question is answerable without
 * reading it: the answer is always the first button.
 *
 * The shuffle is **seeded**, not random, for two reasons. A page rendered on the
 * server and then hydrated must produce identical markup, and `Math.random()`
 * would not. And a child who gets a question wrong and tries again should find
 * the options where they left them, rather than hunting for the one they already
 * ruled out.
 */

/** FNV-1a: small, fast, and spreads similar strings apart. */
function hash(seed: string): number {
  let value = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    value ^= seed.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

/** mulberry32 — a small PRNG with a good enough spread for shuffling buttons. */
function random(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates, driven by the seeded generator. Never mutates the input. */
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const out = [...items];
  const next = random(hash(seed));

  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    const a = out[i];
    const b = out[j];
    if (a !== undefined && b !== undefined) {
      out[i] = b;
      out[j] = a;
    }
  }

  return out;
}
