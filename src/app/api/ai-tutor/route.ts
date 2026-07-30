import { NextResponse } from 'next/server';
import { streamCompletion } from '@/lib/ai/client';
import { MAX_HISTORY_MESSAGES, MAX_MESSAGE_CHARS } from '@/lib/ai/limits';
import { checkOutput, RETRACTED_REPLY } from '@/lib/ai/output-safety';
import { buildSystemPrompt } from '@/lib/ai/prompts';
import { RETRACT_MARKER } from '@/lib/ai/protocol';
import { checkRateLimit } from '@/lib/ai/rate-limit';
import { checkContent, replyFor } from '@/lib/ai/safety';
import { isOverBudget, recordUsage } from '@/lib/ai/spend';
import { isAgeGroupId } from '@/lib/constants';
import type { ChatRole } from '@/types/chat';

/**
 * The one route that talks to Claude.
 *
 * Order matters here: validate, then rate limit, then run the content filter,
 * and only then spend a token. A blocked message never reaches Anthropic, which
 * is both the safety requirement (PRD 8.2) and the reason a child hammering
 * something unpleasant into the box costs nothing.
 */

// The Anthropic SDK wants Node, and the API key must never reach the edge cache.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface IncomingMessage {
  role: ChatRole;
  content: string;
}

function isIncomingMessage(value: unknown): value is IncomingMessage {
  if (typeof value !== 'object' || value === null) return false;
  const { role, content } = value as Record<string, unknown>;
  return (role === 'user' || role === 'assistant') && typeof content === 'string';
}

/**
 * Best-effort caller identity for rate limiting only. Never stored, never
 * logged, never sent anywhere — v1.0 keeps no server-side user data (PRD 9.1).
 */
function callerKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'local';
}

function textStream(chunks: AsyncIterable<string>): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      } catch (error) {
        // The client has already rendered part of an answer, so a status code is
        // no longer available to us. Finish the sentence honestly instead of
        // stopping mid-word and leaving a child staring at a half-formed reply.
        console.error('[ai-tutor] stream failed:', error);
        controller.enqueue(
          encoder.encode(
            '\n\nOh no — my circuits hiccupped and I lost my train of thought. Could you ask me again?',
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      // Stops proxies buffering the stream into one lump at the end.
      'X-Accel-Buffering': 'no',
    },
  });
}

/** Sends a canned reply down the same stream the UI already knows how to read. */
function cannedStream(text: string): Response {
  async function* once() {
    yield text;
  }
  return textStream(once());
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body.' }, { status: 400 });
  }

  const { ageGroup, messages } = (body ?? {}) as Record<string, unknown>;

  if (!isAgeGroupId(ageGroup)) {
    return NextResponse.json({ error: 'Unknown age group.' }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0 || !messages.every(isIncomingMessage)) {
    return NextResponse.json({ error: 'Expected a non-empty list of messages.' }, { status: 400 });
  }

  const history = messages.slice(-MAX_HISTORY_MESSAGES).map(({ role, content }) => ({
    role,
    content: content.slice(0, MAX_MESSAGE_CHARS),
  }));

  const latest = history[history.length - 1];
  if (!latest || latest.role !== 'user' || latest.content.trim().length === 0) {
    return NextResponse.json({ error: 'The last message must be from the child.' }, { status: 400 });
  }

  const limit = checkRateLimit(callerKey(request));
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Phew! That was a lot of questions at once. Give me a moment to catch up." },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  // PRD 8.2 — every message is filtered before it can reach the model.
  // Checked before the budget, so a blocked message still gets its kind reply
  // on a day the cap has been hit. It costs nothing to send.
  const canned = replyFor(checkContent(latest.content));
  if (canned) return cannedStream(canned);

  if (isOverBudget()) {
    return NextResponse.json(
      { error: "I've done a lot of thinking today and need a rest. Try again tomorrow!" },
      { status: 503, headers: { 'Retry-After': '3600' } },
    );
  }

  // Aborting on retraction stops us paying for the rest of a reply we have
  // already decided not to show.
  const upstream = new AbortController();
  request.signal.addEventListener('abort', () => upstream.abort(), { once: true });

  return textStream(
    guardOutput(
      streamCompletion({
        system: buildSystemPrompt(ageGroup),
        messages: history,
        signal: upstream.signal,
        onUsage: ({ inputTokens, outputTokens }) => recordUsage(inputTokens, outputTokens),
      }),
      upstream,
    ),
  );
}

/**
 * The output-side filter, applied as the reply streams.
 *
 * Scanning the text accumulated so far on every chunk is quadratic, but the
 * reply is capped at 600 tokens, so the worst case is a few thousand characters
 * — far cheaper than the network round trip it rides on.
 */
async function* guardOutput(
  chunks: AsyncIterable<string>,
  upstream: AbortController,
): AsyncGenerator<string> {
  let full = '';

  for await (const chunk of chunks) {
    full += chunk;

    const verdict = checkOutput(full);
    if (verdict.kind === 'retract') {
      console.warn(`[ai-tutor] retracted a reply (${verdict.concern})`);
      upstream.abort();
      yield RETRACT_MARKER + RETRACTED_REPLY;
      return;
    }

    yield chunk;
  }
}

/** Anything other than POST, so a curious browser tab gets a clear answer. */
export function GET() {
  return NextResponse.json({ error: 'Use POST.' }, { status: 405, headers: { Allow: 'POST' } });
}
