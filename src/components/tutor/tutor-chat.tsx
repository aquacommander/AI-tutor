'use client';

import Image from 'next/image';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, RotateCcw, Send, Sparkles, Square } from 'lucide-react';
import { AiMarkdown } from '@/components/ui/ai-markdown';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { SUGGESTED_PROMPTS } from '@/data/tutor-prompts';
import { useAiStream } from '@/hooks/use-ai-stream';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { MAX_MESSAGE_CHARS } from '@/lib/ai/limits';
import { AGE_GROUP_LABEL, AGE_GROUP_RANGE, ROUTES } from '@/lib/constants';
import { img } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types/chat';

const TUTOR_XP = 15;

/** Show the counter only once it starts to matter. */
const COUNTER_THRESHOLD = MAX_MESSAGE_CHARS * 0.8;

export function TutorChat() {
  const { learner, isLoaded, awardXp } = useLearnerProgress();
  const ageGroup = learner?.ageGroup ?? null;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const { output, status, error, send, stop, reset } = useAiStream(ageGroup);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const messageId = useRef(0);
  const hasAwarded = useRef(false);

  const nextId = () => `m${++messageId.current}`;

  // Follow the reply as it grows, but stop the moment the child scrolls up to
  // re-read something — yanking them back to the bottom mid-sentence is worse
  // than losing the newest line.
  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }, []);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages, output, status]);

  const ask = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || status === 'streaming') return;

      const history = [...messages, { id: nextId(), role: 'user' as const, content: question }];
      setMessages(history);
      setDraft('');
      stickToBottom.current = true;

      const reply = await send(history.map(({ role, content }) => ({ role, content })));
      if (!reply) return;

      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', content: reply }]);

      // Once per visit — the reward is for starting a conversation, not for
      // sending a lot of messages.
      if (!hasAwarded.current) {
        hasAwarded.current = true;
        awardXp(
          TUTOR_XP,
          {
            id: 'tutor-chat',
            label: 'Asked Sparky a question',
            detail: 'Started a conversation with the AI tutor',
          },
          ['curious-mind'],
        );
      }
    },
    [awardXp, messages, send, status],
  );

  /** Keep whatever Sparky managed to say instead of throwing it away. */
  const handleStop = () => {
    const partial = output.trim();
    stop();
    if (partial) setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', content: partial }]);
  };

  const handleClear = () => {
    reset();
    setMessages([]);
    setDraft('');
    inputRef.current?.focus();
  };

  /** The last question is still in `messages`, so retrying just re-sends it. */
  const handleRetry = () => {
    void send(messages.map(({ role, content }) => ({ role, content })));
  };

  if (!isLoaded) return <ChatSkeleton />;
  if (!ageGroup) return <NeedsAgeGroup />;

  const isStreaming = status === 'streaming';
  const isEmpty = messages.length === 0;

  return (
    <Container className="pb-4">
      <Card className="mx-auto flex h-[min(72vh,760px)] max-w-3xl flex-col overflow-hidden p-0">
        <header className="flex items-center gap-3 border-b border-border-soft bg-primary-surface px-4 py-3">
          <Image
            {...img('brand/sparky-avatar.webp')}
            alt=""
            aria-hidden="true"
            sizes="56px"
            priority
            className="size-11 shrink-0 rounded-full bg-white object-contain p-0.5 shadow-card"
          />
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-lg font-bold leading-tight">Sparky</h1>
            <p className="text-xs text-ink-soft">
              Explaining things for {AGE_GROUP_LABEL[ageGroup]}s, ages {AGE_GROUP_RANGE[ageGroup]}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={isEmpty && !error}
            className="shrink-0"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">New chat</span>
            <span className="sr-only sm:hidden">Start a new chat</span>
          </Button>
        </header>

        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto overscroll-contain px-4 py-5"
        >
          {isEmpty && !isStreaming ? (
            <EmptyState ageGroup={ageGroup} onPick={(prompt) => void ask(prompt)} />
          ) : null}

          {/* Completed messages announce themselves once. The bubble that is
              still arriving is not live, so a screen reader is not read a
              half-finished sentence several times a second. */}
          <ul className="space-y-4" aria-live="polite" aria-atomic="false">
            {messages.map((message) => (
              <li key={message.id}>
                <Bubble role={message.role} content={message.content} />
              </li>
            ))}
          </ul>

          {isStreaming ? (
            <div className="mt-4">
              {output ? <Bubble role="assistant" content={output} /> : <Thinking />}
            </div>
          ) : null}

          {error ? (
            <div
              role="alert"
              className="mt-4 rounded-card border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-ink"
            >
              <p>{error}</p>
              <Button variant="secondary" size="sm" onClick={handleRetry} className="mt-3">
                Try again
              </Button>
            </div>
          ) : null}
        </div>

        <form
          className="border-t border-border-soft bg-surface px-4 py-3"
          onSubmit={(event) => {
            event.preventDefault();
            void ask(draft);
          }}
        >
          <div className="flex items-end gap-2">
            <label htmlFor="tutor-input" className="sr-only">
              Ask Sparky a question
            </label>
            <textarea
              id="tutor-input"
              ref={inputRef}
              rows={1}
              value={draft}
              maxLength={MAX_MESSAGE_CHARS}
              placeholder="Ask Sparky anything about AI or coding…"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                // Enter sends; Shift+Enter starts a new line.
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void ask(draft);
                }
              }}
              className="max-h-32 min-h-[48px] flex-1 resize-y rounded-card border border-border-soft bg-surface px-3 py-3 text-base leading-relaxed text-ink placeholder:text-ink-muted focus-visible:border-primary"
            />

            {isStreaming ? (
              <Button variant="secondary" size="md" onClick={handleStop} className="shrink-0">
                <Square className="size-4 fill-current" aria-hidden="true" />
                Stop
              </Button>
            ) : (
              <Button type="submit" size="md" disabled={draft.trim().length === 0} className="shrink-0">
                <Send className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Send</span>
                <span className="sr-only sm:hidden">Send message</span>
              </Button>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-ink-muted">
            <p>Sparky can get things wrong. Chats are never saved.</p>
            {draft.length >= COUNTER_THRESHOLD ? (
              <p aria-live="polite" className={cn(draft.length >= MAX_MESSAGE_CHARS && 'text-coral')}>
                {draft.length} / {MAX_MESSAGE_CHARS}
              </p>
            ) : null}
          </div>
        </form>
      </Card>
    </Container>
  );
}

function Bubble({ role, content }: { role: ChatMessage['role']; content: string }) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      {isUser ? null : (
        <Image
          {...img('brand/sparky-avatar.webp')}
          alt=""
          aria-hidden="true"
          sizes="48px"
          className="size-9 shrink-0 rounded-full bg-primary-surface object-contain p-0.5"
        />
      )}
      <div
        className={cn(
          'max-w-[85%] rounded-card px-4 py-3 leading-relaxed',
          isUser
            ? 'bg-primary text-white'
            : 'border border-border-soft bg-primary-surface/50 text-ink',
        )}
      >
        <p className="sr-only">{isUser ? 'You said' : 'Sparky said'}</p>
        {isUser ? <p className="whitespace-pre-wrap">{content}</p> : <AiMarkdown text={content} />}
      </div>
    </div>
  );
}

function Thinking() {
  return (
    <div className="flex items-center gap-3" role="status">
      <Image
        {...img('brand/sparky-avatar.webp')}
        alt=""
        aria-hidden="true"
        sizes="48px"
        className="size-9 shrink-0 rounded-full bg-primary-surface object-contain p-0.5"
      />
      <span className="flex items-center gap-1.5 rounded-card border border-border-soft bg-primary-surface/50 px-4 py-3.5">
        <span className="sr-only">Sparky is thinking</span>
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            aria-hidden="true"
            className="size-2 animate-thinking rounded-full bg-primary/70 motion-reduce:animate-none"
            style={{ animationDelay: `${dot * 160}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

function EmptyState({
  ageGroup,
  onPick,
}: {
  ageGroup: keyof typeof SUGGESTED_PROMPTS;
  onPick: (prompt: string) => void;
}) {
  return (
    <div className="mx-auto max-w-lg pb-6 text-center">
      <Image
        {...img('brand/sparky-avatar.webp')}
        alt=""
        aria-hidden="true"
        sizes="120px"
        priority
        className="mx-auto size-24 object-contain"
      />
      <p className="mt-3 font-heading text-xl font-bold">Hi! I&rsquo;m Sparky.</p>
      <p className="mt-1.5 text-sm text-ink-soft">
        Ask me about AI, coding, maths, science, or anything you want to make.
      </p>

      <p id="starter-label" className="mt-6 text-xs font-bold uppercase tracking-wide text-ink-muted">
        Try one of these
      </p>
      <ul aria-labelledby="starter-label" className="mt-3 flex flex-wrap justify-center gap-2">
        {SUGGESTED_PROMPTS[ageGroup].map((prompt) => (
          <li key={prompt}>
            <button
              type="button"
              onClick={() => onPick(prompt)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-button border border-border-soft bg-surface px-4 text-sm font-semibold text-ink shadow-card transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary-surface motion-reduce:hover:translate-y-0"
            >
              <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
              {prompt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Matches the server render so nothing jumps when the profile loads. */
function ChatSkeleton() {
  return (
    <Container className="pb-4">
      <Card className="mx-auto h-[min(72vh,760px)] max-w-3xl p-0">
        <div className="h-full animate-pulse rounded-card bg-primary-surface/40" />
        <span className="sr-only">Loading Sparky</span>
      </Card>
    </Container>
  );
}

function NeedsAgeGroup() {
  return (
    <Container>
      <Card className="mx-auto max-w-2xl text-center">
        <Image
          {...img('brand/sparky-avatar.webp')}
          alt=""
          aria-hidden="true"
          sizes="120px"
          className="mx-auto size-24 object-contain"
        />
        <h1 className="section-title mt-4 font-heading font-bold">Say hello to Sparky</h1>
        <p className="body-large mt-3 text-ink-soft">
          Pick an age group first and Sparky will explain things at just the right level.
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href={ROUTES.ageSelect} size="lg">
            Choose my age group
            <ArrowRight className="size-5" aria-hidden="true" />
          </ButtonLink>
        </div>
      </Card>
    </Container>
  );
}
