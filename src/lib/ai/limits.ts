/**
 * Shared between the route and the chat UI, so the textarea counter and the
 * server's validation can never disagree. No `server-only` here — this module
 * is meant to be imported by client components.
 */

/** PRD 5.5 — conversation history sent with each request. */
export const MAX_HISTORY_MESSAGES = 20;

/** A child asking a question, not pasting an essay. */
export const MAX_MESSAGE_CHARS = 1_000;
