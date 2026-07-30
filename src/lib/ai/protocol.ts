/**
 * The one thing the streaming route and the browser must agree on.
 *
 * Output filtering has an awkward constraint: by the time a problem is
 * detected, part of the reply is already on the child's screen. Buffering the
 * whole answer first would remove that problem and also remove streaming, which
 * for a child watching Sparky "think" is most of the experience.
 *
 * So the server sends this marker instead. Everything before it is to be
 * discarded; everything after it is the replacement. A NUL byte cannot appear
 * in model output, so there is nothing for a clever message to imitate.
 *
 * Written as escapes rather than literal control characters — a raw NUL in a
 * source file is invisible in review and gets stripped by some tooling.
 */
export const RETRACT_MARKER = '\u0000RETRACT\u0000';
