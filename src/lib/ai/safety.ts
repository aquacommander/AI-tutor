/**
 * Server-side content filter. Runs on every message *before* it is forwarded to
 * Claude — the first of the two layers PRD section 8.2 asks for, the second
 * being the system-prompt guardrail in `prompts.ts`.
 *
 * The hard part here is not blocking things. It is not blocking the wrong
 * things: this is a programming site for children, and a naive violence filter
 * would reject "how do I kill a process in Python?", "my thread won't
 * terminate", or "the script aborts" — all ordinary Builder questions. Every
 * pattern below therefore requires an animate object or an explicitly violent
 * frame, never a bare verb. The fixtures in `safety.fixtures.ts` lock that in.
 */

export type SafetyVerdict =
  | { kind: 'ok' }
  /** Off-limits topic. Sparky redirects warmly rather than scolding. */
  | { kind: 'blocked'; category: BlockedCategory }
  /**
   * Something that sounds like a child in distress. Deliberately *not* treated
   * as a blocked topic — see `CONCERN_REPLY`.
   */
  | { kind: 'concern' };

export type BlockedCategory = 'violence' | 'adult' | 'political' | 'profane';

interface Rule {
  category: BlockedCategory;
  patterns: RegExp[];
}

const RULES: Rule[] = [
  {
    category: 'violence',
    patterns: [
      // Requires a person as the object. "kill a process" must not match.
      /\bkill(?:ing)?\s+(?:him|her|them|someone|somebody|people|myself|yourself|himself|herself)\b/i,
      /\bkill(?:ing)?\s+(?:a|the|my|your)\s+(?:person|people|man|woman|boy|girl|child|kid|baby|human|guy|teacher|friend)\b/i,
      /\bhow\s+(?:to|do\s+i)\s+(?:make|build|create)\s+(?:a\s+)?(?:bomb|gun|weapon|explosive|grenade|missile)\b/i,
      /\b(?:shoot|stab|strangle|murder|behead)\s+(?:him|her|them|someone|somebody|people|a\s+person)\b/i,
      /\bhurt\s+(?:someone|somebody|people|him|her|them)\b/i,
    ],
  },
  {
    category: 'adult',
    patterns: [/\b(?:porn|pornography|nsfw|sexual|sex\s+(?:scene|video|story))\b/i, /\bnudes?\b/i],
  },
  {
    category: 'political',
    patterns: [
      /\bwho\s+should\s+(?:i|we)\s+vote\s+for\b/i,
      /\b(?:abortion|immigration\s+policy|gun\s+control)\b/i,
      /\bis\s+\w+\s+(?:a\s+)?(?:good|bad)\s+president\b/i,
    ],
  },
  {
    category: 'profane',
    patterns: [
      /\bf+u+c+k+\w*/i,
      /\bs+h+i+t+\w*/i,
      /\b(?:bitch|bastard|asshole|dickhead|cunt)\b/i,
    ],
  },
];

/**
 * Phrases that sound like a child in trouble.
 *
 * These must never be handled like an off-topic question. A child typing
 * something frightening and getting "Let's talk about coding instead!" is the
 * worst outcome this product can produce, so they route to `CONCERN_REPLY`,
 * which points at a trusted adult.
 *
 * This is a deliberately narrow, high-signal list, and it is not a substitute
 * for professional safeguarding review — flag it for a qualified reviewer
 * before public release.
 */
const CONCERN_PATTERNS: RegExp[] = [
  /\b(?:kill|hurt|harm)\s+(?:myself|me)\b/i,
  /\bi\s+want\s+to\s+die\b/i,
  /\bsuicide\b/i,
  /\bcut(?:ting)?\s+myself\b/i,
  /\b(?:no\s+one|nobody)\s+(?:loves|likes|wants)\s+me\b/i,
  /\bi\s+(?:hate|want\s+to\s+hurt)\s+myself\b/i,
];

export function checkContent(message: string): SafetyVerdict {
  // Concern is checked first: "kill myself" must reach the supportive reply,
  // never the violence rule.
  for (const pattern of CONCERN_PATTERNS) {
    if (pattern.test(message)) return { kind: 'concern' };
  }

  for (const rule of RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(message)) return { kind: 'blocked', category: rule.category };
    }
  }

  return { kind: 'ok' };
}

/** Kept as a boolean helper because PRD section 8.2 names this function. */
export function containsUnsafeContent(message: string): boolean {
  return checkContent(message).kind !== 'ok';
}

/**
 * Warm redirects, written to be read by a six-year-old. They never repeat the
 * blocked wording back, and they never tell the child off — the child may have
 * typed something they heard elsewhere without knowing what it meant.
 */
const BLOCKED_REPLIES: Record<BlockedCategory, string> = {
  violence:
    "That's not something I can help with, but I'd love to talk about something else! Want to build a game character, or find out how robots see the world?",
  adult:
    "That one's not for me, I'm afraid! I'm best at AI, coding, and making things. Shall we write a story together instead?",
  political:
    "Grown-ups have lots of different views on that one, and it's a good thing to talk about with your family. I'm best at AI and coding — want to try a puzzle?",
  profane:
    "Let's keep our words kind! I'm here whenever you want to code, create, or ask me how AI works.",
};

export function blockedReply(category: BlockedCategory): string {
  return BLOCKED_REPLIES[category];
}

/**
 * Reply for the concern path. Points at a real person rather than trying to be
 * one — Sparky is a tutor, not a counsellor, and must not be built to act like
 * one. Needs sign-off from a qualified safeguarding reviewer.
 */
export const CONCERN_REPLY =
  "That sounds really hard, and I'm sorry you're feeling this way. I'm just a robot who teaches coding, so I'm not the best one to help with this — but a grown-up you trust is. Please tell a parent, a carer, or a teacher how you're feeling. They'll want to know, and they can help.";

/** The canned answer for a message that never reaches the model. */
export function replyFor(verdict: SafetyVerdict): string | null {
  if (verdict.kind === 'ok') return null;
  return verdict.kind === 'concern' ? CONCERN_REPLY : blockedReply(verdict.category);
}
