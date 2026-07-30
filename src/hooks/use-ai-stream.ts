'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AgeGroupId } from '@/types/learner';
import { RETRACT_MARKER } from '@/lib/ai/protocol';
import type { ChatMessage } from '@/types/chat';

export type AiStreamStatus = 'idle' | 'streaming' | 'error';

type OutgoingMessage = Pick<ChatMessage, 'role' | 'content'>;

export interface UseAiStream {
  /** Text received so far for the request in flight. Cleared when a new one starts. */
  output: string;
  status: AiStreamStatus;
  /** Child-readable message. Never a stack trace or a status code. */
  error: string | null;
  /** Resolves with the complete reply, or null if it was stopped or failed. */
  send: (messages: OutgoingMessage[]) => Promise<string | null>;
  stop: () => void;
  reset: () => void;
}

const FRIENDLY_ERROR =
  "I couldn't reach my brain just then. Check your internet and give it another go.";

/**
 * Shared transport for everything that talks to Sparky — the tutor chat and the
 * Creative Studio both use this.
 *
 * It owns exactly one concern: turning a list of messages into text arriving a
 * piece at a time. It deliberately does *not* own the conversation, because the
 * studio has no conversation — it makes one-shot requests. Callers keep their
 * own history and pass it in.
 */
export function useAiStream(ageGroup: AgeGroupId | null): UseAiStream {
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<AiStreamStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  // A reply still arriving when the child navigates away would otherwise keep
  // the connection open and call setState on an unmounted component.
  useEffect(() => () => controllerRef.current?.abort(), []);

  const stop = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setStatus('idle');
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setOutput('');
    setError(null);
    setStatus('idle');
  }, []);

  const send = useCallback<UseAiStream['send']>(
    async (messages) => {
      if (!ageGroup) {
        setError('Pick an age group first so Sparky knows how to explain things.');
        setStatus('error');
        return null;
      }

      // A second question while the first is still arriving replaces it rather
      // than interleaving two streams into the same buffer.
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setOutput('');
      setError(null);
      setStatus('streaming');

      try {
        const response = await fetch('/api/ai-tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ageGroup, messages }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          const message = await readErrorMessage(response);
          setError(message);
          setStatus('error');
          return null;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let full = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });

          // The server retracts a reply by sending a marker: throw away
          // everything already shown, keep only what follows.
          if (full.includes('\u0000')) {
            const marker = full.indexOf(RETRACT_MARKER);
            // Still arriving — render nothing rather than a half-drawn marker.
            if (marker === -1) continue;
            full = full.slice(marker + RETRACT_MARKER.length);
          }

          setOutput(full);
        }
        full += decoder.decode();

        setStatus('idle');
        controllerRef.current = null;
        return full;
      } catch (cause) {
        // Stopping on purpose is not a failure — leave the UI calm.
        if (cause instanceof DOMException && cause.name === 'AbortError') return null;
        setError(FRIENDLY_ERROR);
        setStatus('error');
        return null;
      }
    },
    [ageGroup],
  );

  return { output, status, error, send, stop, reset };
}

/** The route sends `{ error }` for anything it refuses; fall back if it did not. */
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body.error === 'string' && body.error.length > 0) return body.error;
  } catch {
    /* not JSON */
  }
  return FRIENDLY_ERROR;
}
