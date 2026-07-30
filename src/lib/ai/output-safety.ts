/**
 * The second safety layer: what Sparky says, not what the child typed.
 *
 * `safety.ts` guards the input. This guards the output, because a system prompt
 * is an instruction and instructions can be talked around. Today the model
 * behaves; a filter exists for the day it does not.
 *
 * It is a **tripwire, not a classifier**. It looks for a short list of things
 * that should never reach a child from an automated tutor, and it is tuned to
 * almost never fire on a good answer — a retracted correct explanation is a
 * child being told the computer broke, which has its own cost.
 */

export type OutputConcern = 'link' | 'contact-request' | 'impersonation' | 'unsafe' | 'profane';

export type OutputVerdict = { kind: 'ok' } | { kind: 'retract'; concern: OutputConcern };

/**
 * Code is excluded before scanning. `requests.get("https://api.example.com")`
 * is a teaching example; the same URL in a sentence is Sparky sending a child
 * somewhere nobody reviewed. Only the second one matters.
 */
function prose(text: string): string {
  return text.replace(/```[\s\S]*?(?:```|$)/g, ' ').replace(/`[^`]*`/g, ' ');
}

const RULES: Array<{ concern: OutputConcern; patterns: RegExp[] }> = [
  {
    // No allowlist exists, so any web address is one nobody has checked.
    concern: 'link',
    patterns: [/\bhttps?:\/\/\S/i, /\bwww\.[a-z0-9-]+\.[a-z]{2,}/i],
  },
  {
    concern: 'contact-request',
    patterns: [
      /\bwhat(?:'s| is| are)\s+your\s+(?:real\s+)?(?:name|address|phone|number|school|email)\b/i,
      /\bwhere\s+do\s+you\s+(?:live|go\s+to\s+school)\b/i,
      /\btell\s+me\s+your\s+(?:real\s+)?(?:name|address|phone|school|email)\b/i,
      /\bhow\s+old\s+are\s+you\b/i,
    ],
  },
  {
    // "I'm not a real person" must pass; "I am a real person" must not.
    concern: 'impersonation',
    patterns: [/\bI(?:'m|\s+am)\s+(?!not\b)(?:a\s+)?(?:real\s+person|real\s+human|human being)\b/i],
  },
  {
    concern: 'unsafe',
    patterns: [
      /\b(?:porn|pornography|nsfw)\b/i,
      /\bhow\s+to\s+(?:kill|hurt|harm)\s+(?:yourself|myself)\b/i,
      /\bhow\s+to\s+(?:make|build)\s+(?:a\s+)?(?:bomb|explosive|gun)\b/i,
    ],
  },
  {
    concern: 'profane',
    patterns: [/\bf+u+c+k+\w*/i, /\bs+h+i+t+\w*/i, /\b(?:bitch|bastard|asshole|dickhead|cunt)\b/i],
  },
];

export function checkOutput(text: string): OutputVerdict {
  const body = prose(text);

  for (const rule of RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(body)) return { kind: 'retract', concern: rule.concern };
    }
  }

  return { kind: 'ok' };
}

/**
 * Deliberately vague about what happened. A child does not need to know their
 * tutor said something it should not have, and naming the reason would tell
 * anyone probing the system exactly which wall they hit.
 */
export const RETRACTED_REPLY =
  "Hmm, that answer came out wrong and I've thrown it away. Let's try again — could you ask me a different way?";
