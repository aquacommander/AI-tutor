'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { ArrowRight, Check, Circle, Lightbulb, Play, RotateCcw } from 'lucide-react';
import { AiMarkdown } from '@/components/ui/ai-markdown';
import { Badge, DifficultyBadge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { codeChallenges } from '@/data/code-challenges';
import { useAiStream } from '@/hooks/use-ai-stream';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { ROUTES } from '@/lib/constants';
import { evaluateCode, type Evaluation } from '@/lib/code-lab';
import { img } from '@/lib/images';
import { cn } from '@/lib/utils';

const INDENT = '    ';

export function CodeLab() {
  const { learner, isLoaded, completeChallenge } = useLearnerProgress();
  const ageGroup = learner?.ageGroup ?? null;
  const solvedIds = learner?.completedChallenges ?? [];

  const [activeId, setActiveId] = useState(codeChallenges[0]!.id);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [justEarned, setJustEarned] = useState<number | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  // Tab normally moves focus. Escape first, then Tab, restores that — otherwise
  // a keyboard user would be trapped in the editor with no way out.
  const escapeArmed = useRef(false);

  const { output, status, error, send } = useAiStream(ageGroup);

  const challenge = codeChallenges.find((item) => item.id === activeId) ?? codeChallenges[0]!;
  const code = drafts[challenge.id] ?? challenge.starterCode;
  const isSolved = solvedIds.includes(challenge.id);

  const selectChallenge = (id: string) => {
    setActiveId(id);
    setEvaluation(null);
    setJustEarned(null);
    setHint(null);
  };

  const updateCode = (value: string) => {
    setDrafts((prev) => ({ ...prev, [challenge.id]: value }));
    // Results from the previous version of the code are worse than no results.
    setEvaluation(null);
    setJustEarned(null);
  };

  const check = () => {
    const result = evaluateCode(challenge, code);
    setEvaluation(result);

    if (result.solved && completeChallenge(challenge.id, challenge.xpReward, {
      id: `code-${challenge.id}`,
      label: `Solved ${challenge.title}`,
      detail: 'Code Lab challenge complete',
    })) {
      setJustEarned(challenge.xpReward);
    }
  };

  const resetCode = () => {
    setDrafts((prev) => ({ ...prev, [challenge.id]: challenge.starterCode }));
    setEvaluation(null);
    setJustEarned(null);
    editorRef.current?.focus();
  };

  const askForHint = useCallback(async () => {
    setHint(null);
    const reply = await send([
      {
        role: 'user',
        content: [
          `I am working on a Python challenge called "${challenge.title}".`,
          `The task is: ${challenge.instructions.join(' ')}`,
          'Here is my code so far:',
          '```python',
          code,
          '```',
          'Give me ONE small hint that helps me get unstuck. Do not write the whole answer for me.',
        ].join('\n'),
      },
    ]);
    if (reply) setHint(reply);
  }, [challenge.instructions, challenge.title, code, send]);

  /** Python is indentation-sensitive, so the editor helps rather than fighting. */
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = event.currentTarget;

    if (event.key === 'Escape') {
      escapeArmed.current = true;
      return;
    }

    if (event.key === 'Tab') {
      if (escapeArmed.current) {
        escapeArmed.current = false;
        return; // Let focus move on.
      }
      event.preventDefault();
      const { selectionStart, selectionEnd, value } = el;
      updateCode(value.slice(0, selectionStart) + INDENT + value.slice(selectionEnd));
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = selectionStart + INDENT.length;
      });
      return;
    }

    escapeArmed.current = false;

    if (event.key === 'Enter') {
      const { selectionStart, value } = el;
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
      const line = value.slice(lineStart, selectionStart);
      const indent = /^[ \t]*/.exec(line)?.[0] ?? '';
      const deeper = line.trimEnd().endsWith(':') ? INDENT : '';
      if (!indent && !deeper) return;

      event.preventDefault();
      const insert = `\n${indent}${deeper}`;
      updateCode(value.slice(0, selectionStart) + insert + value.slice(el.selectionEnd));
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = selectionStart + insert.length;
      });
    }
  };

  if (!isLoaded) return <LabSkeleton />;
  if (!ageGroup) return <NeedsAgeGroup />;

  return (
    <Container className="space-y-6">
      <header>
        <h1 className="section-title font-heading font-bold">Code Lab</h1>
        <p className="body-large mt-2 text-ink-soft">
          Write Python, check your work, and earn XP. {solvedIds.length} of {codeChallenges.length}{' '}
          challenges solved.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <nav aria-label="Challenges">
          <ul className="space-y-3">
            {codeChallenges.map((item) => {
              const done = solvedIds.includes(item.id);
              const active = item.id === challenge.id;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => selectChallenge(item.id)}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'w-full rounded-card border p-4 text-left transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
                      active
                        ? 'border-primary bg-primary-surface shadow-card-hover'
                        : 'border-border-soft bg-surface shadow-card hover:border-primary/40',
                    )}
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span className="font-heading font-bold">{item.title}</span>
                      {done ? (
                        <Check className="size-5 shrink-0 text-grass-dark" aria-hidden="true" />
                      ) : null}
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-2">
                      <DifficultyBadge difficulty={item.difficulty} />
                      <Badge tone="orange">+{item.xpReward} XP</Badge>
                    </span>
                    {/* State is spelled out, never signalled by the tick alone. */}
                    <span className="mt-2 block text-xs font-semibold text-ink-muted">
                      {done ? 'Solved' : 'Not solved yet'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0 space-y-5">
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="card-title font-heading">{challenge.title}</h2>
              <DifficultyBadge difficulty={challenge.difficulty} />
              <Badge tone="orange">+{challenge.xpReward} XP</Badge>
            </div>
            <p className="mt-2 text-ink-soft">{challenge.brief}</p>

            <h3 className="mt-4 font-heading font-bold">What to do</h3>
            <ol className="mt-2 ml-5 list-decimal space-y-1 text-ink-soft">
              {challenge.instructions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </Card>

          <Card className="p-0">
            <label htmlFor="code-editor" className="sr-only">
              Python code for {challenge.title}
            </label>
            {/* No `outline-none` on the editor: the global focus ring is the
                only thing telling a keyboard user where they are. */}
            <textarea
              id="code-editor"
              ref={editorRef}
              value={code}
              onChange={(event) => updateCode(event.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              rows={14}
              className="w-full resize-y rounded-t-card bg-ink px-4 py-4 font-mono text-sm leading-relaxed text-white"
            />
            <p className="border-t border-border-soft px-4 py-2 text-xs text-ink-muted">
              Tab adds an indent. Press Escape then Tab to move on to the buttons.
            </p>

            <div className="flex flex-wrap gap-3 border-t border-border-soft px-4 py-3">
              <Button size="md" onClick={check}>
                <Play className="size-4" aria-hidden="true" />
                Check my code
              </Button>
              <Button variant="secondary" size="md" onClick={() => void askForHint()} disabled={status === 'streaming'}>
                <Lightbulb className="size-4" aria-hidden="true" />
                {status === 'streaming' ? 'Sparky is thinking…' : 'Get a hint'}
              </Button>
              <Button variant="ghost" size="md" onClick={resetCode}>
                <RotateCcw className="size-4" aria-hidden="true" />
                Start over
              </Button>
            </div>
          </Card>

          {evaluation ? (
            <Card role="status" className={cn(evaluation.solved && 'border-grass bg-grass-light')}>
              {evaluation.untouched ? (
                <p className="text-ink-soft">
                  The starter code is still exactly as it was. Have a go at changing it, then check
                  again.
                </p>
              ) : (
                <>
                  <h3 className="font-heading font-bold">
                    {evaluation.solved ? 'Brilliant — that works!' : 'Nearly there'}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {evaluation.results.map((result) => (
                      <li key={result.label} className="flex items-start gap-2 text-sm">
                        {result.passed ? (
                          <Check className="mt-0.5 size-4 shrink-0 text-grass-dark" aria-hidden="true" />
                        ) : (
                          <Circle className="mt-0.5 size-4 shrink-0 text-ink-muted" aria-hidden="true" />
                        )}
                        <span className={cn(result.passed ? 'text-ink' : 'text-ink-soft')}>
                          <span className="sr-only">{result.passed ? 'Done: ' : 'Still to do: '}</span>
                          {result.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {justEarned !== null ? (
                    <p className="mt-4 flex items-center gap-2 font-heading font-bold text-grass-dark">
                      <Image
                        {...img('rewards/xp-coin.webp')}
                        alt=""
                        aria-hidden="true"
                        sizes="32px"
                        className="size-6 object-contain"
                      />
                      +{justEarned} XP added to your dashboard
                    </p>
                  ) : null}

                  {evaluation.solved && justEarned === null ? (
                    <p className="mt-4 text-sm text-ink-soft">
                      You had already solved this one, so no extra XP this time.
                    </p>
                  ) : null}
                </>
              )}
            </Card>
          ) : null}

          {status === 'streaming' && output ? <HintCard>{output}</HintCard> : null}
          {hint && status !== 'streaming' ? <HintCard>{hint}</HintCard> : null}
          {error ? (
            <Card role="alert" className="border-coral/40 bg-coral/10 text-sm">
              {error}
            </Card>
          ) : null}

          {isSolved ? (
            <details className="rounded-card border border-border-soft bg-surface p-4 shadow-card">
              <summary className="cursor-pointer font-heading font-bold">
                See one way of solving it
              </summary>
              <p className="mt-2 text-sm text-ink-soft">
                Yours does not have to look like this. There is more than one right answer.
              </p>
              <pre className="mt-3 overflow-x-auto rounded-card bg-ink px-4 py-3 text-sm leading-relaxed text-white">
                <code>{challenge.solution}</code>
              </pre>
            </details>
          ) : null}
        </div>
      </div>
    </Container>
  );
}

function HintCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="border-sunshine bg-sunshine-light">
      <p className="flex items-center gap-2 font-heading font-bold">
        <Lightbulb className="size-5 text-sunshine-dark" aria-hidden="true" />
        Sparky&rsquo;s hint
      </p>
      <div className="mt-2 text-sm leading-relaxed">
        {typeof children === 'string' ? <AiMarkdown text={children} /> : children}
      </div>
    </Card>
  );
}

function LabSkeleton() {
  return (
    <Container>
      <div className="h-[60vh] animate-pulse rounded-card bg-primary-surface/40" />
      <span className="sr-only">Loading the Code Lab</span>
    </Container>
  );
}

function NeedsAgeGroup() {
  return (
    <Container>
      <Card className="mx-auto max-w-2xl text-center">
        <Image
          {...img('features/code-lab.webp')}
          alt=""
          aria-hidden="true"
          sizes="120px"
          className="mx-auto size-24 object-contain"
        />
        <h1 className="section-title mt-4 font-heading font-bold">Welcome to the Code Lab</h1>
        <p className="body-large mt-3 text-ink-soft">
          Pick an age group first so the challenges and Sparky&rsquo;s hints match your level.
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
