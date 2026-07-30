import Anthropic from '@anthropic-ai/sdk';
import type { ChatMessage } from '@/types/chat';

/**
 * The single point where this application talks to Anthropic.
 *
 * Everything upstream — the route, the hook, the chat UI, the Creative Studio —
 * consumes the async iterable of text chunks below and knows nothing about the
 * provider. Swapping models, adding retries, or changing SDK shape happens here
 * and nowhere else.
 *
 * `server-only` makes the boundary enforceable rather than conventional: if any
 * client component ever imports this file, the build fails instead of quietly
 * shipping the SDK — and potentially the key — into the browser bundle.
 */
import 'server-only';

/** PRD section 6.1. Fast and inexpensive, which suits short tutoring replies. */
const MODEL = 'claude-haiku-4-5';

/** PRD section 6.3. Sparky answers briefly; long lectures are not the goal. */
const MAX_TOKENS = 600;

export function isConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

export interface CompletionOptions {
  system: string;
  messages: Array<Pick<ChatMessage, 'role' | 'content'>>;
  maxTokens?: number;
  signal?: AbortSignal;
  /**
   * Called once the reply finishes, with what it cost. A side channel because
   * the generator itself yields only text — the caller should not have to
   * unpick usage records out of the thing it is rendering.
   */
  onUsage?: (usage: { inputTokens: number; outputTokens: number }) => void;
}

/**
 * Streams a reply as plain text chunks.
 *
 * Falls back to `streamDevelopmentReply` when no API key is present. That is
 * keyed on the environment, not on a flag someone has to remember to flip, so a
 * production deploy with a key configured can never serve a stub.
 */
export async function* streamCompletion(options: CompletionOptions): AsyncGenerator<string> {
  if (!isConfigured()) {
    yield* streamDevelopmentReply();
    return;
  }

  const stream = getClient().messages.stream(
    {
      model: MODEL,
      max_tokens: options.maxTokens ?? MAX_TOKENS,
      system: options.system,
      messages: options.messages.map(({ role, content }) => ({ role, content })),
    },
    { signal: options.signal },
  );

  let inputTokens = 0;
  let outputTokens = 0;

  for await (const event of stream) {
    if (event.type === 'message_start') {
      inputTokens = event.message.usage.input_tokens;
    } else if (event.type === 'message_delta') {
      // Cumulative, so the last one seen is the total.
      outputTokens = event.usage.output_tokens;
    } else if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text;
    }
  }

  options.onUsage?.({ inputTokens, outputTokens });
}

const DEVELOPMENT_NOTICE =
  "Hello! I'm Sparky. I'm not properly awake yet — this site has no **Anthropic API key** " +
  'configured, so this is a placeholder reply rather than a real answer. ' +
  'Everything else works: the safety checks ran on your message, and this text is arriving ' +
  'the same way a real answer would. Add `ANTHROPIC_API_KEY` to make me think for myself.';

/**
 * Chunked so the streaming UI — typing indicator, incremental render, scroll
 * behaviour, abort — can be built and tested before the key arrives.
 */
async function* streamDevelopmentReply(): AsyncGenerator<string> {
  for (const word of DEVELOPMENT_NOTICE.split(' ')) {
    await new Promise((resolve) => setTimeout(resolve, 28));
    yield `${word} `;
  }
}
