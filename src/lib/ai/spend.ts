/**
 * A daily ceiling on what the AI features can cost.
 *
 * Same honest caveat as the rate limiter: this is in-memory and per-instance,
 * so it resets on deploy and does not coordinate across serverless instances.
 * It is a brake against a runaway loop or an unexpectedly busy day, not a
 * guarantee.
 *
 * **The real hard cap belongs in the Anthropic console** — set a monthly budget
 * limit on the API key itself. That one cannot be bypassed by anything running
 * here. This exists so the site degrades politely before that limit is hit,
 * instead of every child suddenly seeing errors.
 */

/** Claude Haiku 4.5, USD per million tokens. */
const PRICE_PER_MTOK = { input: 1, output: 5 };

const DEFAULT_DAILY_CAP_USD = 5;

function dailyCapUsd(): number {
  const configured = Number(process.env.AI_DAILY_USD_CAP);
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_DAILY_CAP_USD;
}

let day = '';
let spentUsd = 0;

function today(now: Date): string {
  return now.toISOString().slice(0, 10);
}

function rollOver(now: Date) {
  const current = today(now);
  if (current === day) return;
  day = current;
  spentUsd = 0;
}

export function recordUsage(inputTokens: number, outputTokens: number, now = new Date()) {
  rollOver(now);
  spentUsd +=
    (inputTokens / 1_000_000) * PRICE_PER_MTOK.input +
    (outputTokens / 1_000_000) * PRICE_PER_MTOK.output;
}

export function isOverBudget(now = new Date()): boolean {
  rollOver(now);
  return spentUsd >= dailyCapUsd();
}

/** For a status endpoint or a log line. Never shown to a child. */
export function spendToday(now = new Date()): { spentUsd: number; capUsd: number } {
  rollOver(now);
  return { spentUsd, capUsd: dailyCapUsd() };
}

/** Test seam. */
export function resetSpend() {
  day = '';
  spentUsd = 0;
}
