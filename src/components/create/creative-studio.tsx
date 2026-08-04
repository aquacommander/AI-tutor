'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ArrowRight, Check, Copy, Music, Palette, Sparkles, Wand2 } from 'lucide-react';
import { AiMarkdown } from '@/components/ui/ai-markdown';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { ChoiceGroup, TextInput } from '@/components/ui/field';
import { studioTools, type StudioTool, type StudioToolId } from '@/data/creative-tools';
import { useAiStream } from '@/hooks/use-ai-stream';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { ROUTES } from '@/lib/constants';
import { img } from '@/lib/images';
import { cn } from '@/lib/utils';

const ICONS: Record<StudioToolId, typeof Wand2> = {
  story: Wand2,
  art: Palette,
  music: Music,
};

/** Each tool's defaults, so switching tools does not wipe what was typed. */
function initialValues(): Record<string, Record<string, string>> {
  return Object.fromEntries(
    studioTools.map((tool) => [
      tool.id,
      Object.fromEntries(tool.fields.map((field) => [field.id, field.defaultValue])),
    ]),
  );
}

export function CreativeStudio() {
  const { learner, isLoaded, awardXp } = useLearnerProgress();
  const ageGroup = learner?.ageGroup ?? null;

  const [activeId, setActiveId] = useState<StudioToolId>('story');
  const [values, setValues] = useState(initialValues);
  const [results, setResults] = useState<Partial<Record<StudioToolId, string>>>({});
  const awarded = useRef(new Set<StudioToolId>());

  const { output, status, error, send, reset } = useAiStream(ageGroup);

  const tool = studioTools.find((item) => item.id === activeId) ?? studioTools[0]!;
  const toolValues = values[tool.id] ?? {};
  const isStreaming = status === 'streaming';

  const setField = (fieldId: string, next: string) =>
    setValues((prev) => ({ ...prev, [tool.id]: { ...prev[tool.id], [fieldId]: next } }));

  const make = async () => {
    setResults((prev) => ({ ...prev, [tool.id]: undefined }));

    const reply = await send([{ role: 'user', content: tool.buildPrompt(toolValues) }]);
    if (!reply) return;

    setResults((prev) => ({ ...prev, [tool.id]: reply }));

    // Once per tool per visit — the XP is for making something, not for
    // pressing the button repeatedly.
    if (!awarded.current.has(tool.id)) {
      awarded.current.add(tool.id);

      const badgeIds = tool.id === 'story' ? ['story-weaver'] : [];
      // Super Creator is for using all three tools, so it is checked against
      // what has ever been made, not just this visit.
      if (studioTools.every((item) => results[item.id] || item.id === tool.id)) {
        badgeIds.push('super-creator');
      }

      awardXp(
        tool.xpReward,
        {
          id: `create-${tool.id}`,
          label: `Used the ${tool.title}`,
          detail: 'Made something in the Creative Studio',
        },
        badgeIds,
      );
    }
  };

  const selectTool = (id: StudioToolId) => {
    reset();
    setActiveId(id);
  };

  if (!isLoaded) return <StudioSkeleton />;
  if (!ageGroup) return <NeedsAgeGroup />;

  const result = results[tool.id];

  return (
    <Container className="space-y-6">
      <header>
        <h1 className="section-title font-heading font-bold">Creative Studio</h1>
        <p className="body-large mt-2 text-ink-soft">
          Three tools for making things. Choose one, fill in the blanks, and see what comes out.
        </p>
      </header>

      <nav aria-label="Creative tools">
        <ul className="grid gap-4 sm:grid-cols-3">
          {studioTools.map((item) => {
            const Icon = ICONS[item.id];
            const active = item.id === tool.id;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => selectTool(item.id)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'flex h-full w-full flex-col rounded-card border p-4 text-left transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
                    active
                      ? 'border-primary bg-primary-surface shadow-card-hover'
                      : 'border-border-soft bg-surface shadow-card hover:border-primary/40',
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                    <span className="font-heading font-bold">{item.title}</span>
                  </span>
                  <span className="mt-1.5 text-sm text-ink-soft">{item.tagline}</span>
                  <span className="mt-2 text-xs font-bold text-ink-muted">
                    {active ? 'Selected' : `+${item.xpReward} XP`}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* The form column is wider than it was: showing every option instead of
          hiding them in a dropdown needs the room, and lets short options sit
          two or three to a row. */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
        <Card as="section" aria-labelledby="tool-heading">
          <h2 id="tool-heading" className="card-title font-heading">
            {tool.title}
          </h2>
          <p className="mt-1.5 text-sm text-ink-soft">{tool.note}</p>

          <div className="mt-5 space-y-5">
            {tool.fields.map((field) => {
              const id = `${tool.id}-${field.id}`;

              if (field.type === 'choice') {
                return (
                  <ChoiceGroup
                    key={id}
                    name={id}
                    legend={field.label}
                    options={field.options ?? []}
                    value={toolValues[field.id] ?? field.defaultValue}
                    onChange={(next) => setField(field.id, next)}
                  />
                );
              }

              return (
                <div key={id}>
                  <label htmlFor={id} className="block font-heading text-sm font-bold">
                    {field.label}
                  </label>
                  <TextInput
                    id={id}
                    maxLength={120}
                    value={toolValues[field.id] ?? ''}
                    placeholder={field.placeholder}
                    onChange={(event) => setField(field.id, event.target.value)}
                    className="mt-2"
                  />
                </div>
              );
            })}
          </div>

          <Button size="lg" className="mt-6 w-full" onClick={() => void make()} disabled={isStreaming}>
            <Sparkles className="size-5" aria-hidden="true" />
            {isStreaming ? 'Making it…' : tool.cta}
          </Button>
        </Card>

        {/* `self-start` so the panel does not stretch to the form's full height,
            which would leave sticky nothing to move within. */}
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          {isStreaming || result ? (
            <ResultPanel tool={tool} text={isStreaming ? output : (result ?? '')} busy={isStreaming} />
          ) : (
            <Card className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <Image
                {...img('features/creative-studio.webp')}
                alt=""
                aria-hidden="true"
                sizes="160px"
                className="size-28 object-contain"
              />
              <p className="mt-4 font-heading text-lg font-bold">Nothing made yet</p>
              <p className="mt-1.5 max-w-sm text-sm text-ink-soft">
                Fill in the boxes on the left and press <strong>{tool.cta}</strong>.
              </p>
            </Card>
          )}

          {error ? (
            <Card role="alert" className="mt-4 border-coral/40 bg-coral/10 text-sm">
              {error}
            </Card>
          ) : null}
        </div>
      </div>
    </Container>
  );
}

function ResultPanel({ tool, text, busy }: { tool: StudioTool; text: string; busy: boolean }) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopyFailed(false);
      window.setTimeout(() => setCopied(false), 2_000);
    } catch {
      // Clipboard access is refused in some browsers and on insecure origins.
      setCopyFailed(true);
    }
  };

  return (
    <Card as="section" aria-labelledby="result-heading" className="h-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="result-heading" className="card-title font-heading">
          {busy ? `Making your ${tool.title.toLowerCase()}…` : 'Here it is'}
        </h2>
        {!busy && text ? (
          <Button variant="secondary" size="sm" onClick={() => void copy()}>
            {copied ? (
              <Check className="size-4 text-grass-dark" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        ) : null}
      </div>

      {copyFailed ? (
        <p role="alert" className="mt-2 text-sm text-ink-soft">
          Your browser would not let me copy that. Select the text and copy it yourself.
        </p>
      ) : null}

      {/* Announced once it settles, rather than word by word as it streams. */}
      <div className="mt-4 leading-relaxed" aria-live="polite" aria-busy={busy}>
        {text ? <AiMarkdown text={text} /> : <p className="text-ink-soft">Thinking…</p>}
      </div>
    </Card>
  );
}

function StudioSkeleton() {
  return (
    <Container>
      <div className="h-[60vh] animate-pulse rounded-card bg-primary-surface/40" />
      <span className="sr-only">Loading the Creative Studio</span>
    </Container>
  );
}

function NeedsAgeGroup() {
  return (
    <Container>
      <Card className="mx-auto max-w-2xl text-center">
        <Image
          {...img('features/creative-studio.webp')}
          alt=""
          aria-hidden="true"
          sizes="120px"
          className="mx-auto size-24 object-contain"
        />
        <h1 className="section-title mt-4 font-heading font-bold">Welcome to the Creative Studio</h1>
        <p className="body-large mt-3 text-ink-soft">
          Pick an age group first so your stories, prompts, and music match your level.
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
