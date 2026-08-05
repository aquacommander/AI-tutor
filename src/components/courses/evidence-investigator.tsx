'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, RotateCcw, Search, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DrawingCanvas, RotateHint, WritingBox } from '@/components/ui/make-it';
import { ProgressBar } from '@/components/ui/progress-bar';
import {
  CONCLUSIONS,
  CREATION_CHOICES,
  EVIDENCE_BADGE,
  EVIDENCE_ITEMS,
  EVIDENCE_SCORING,
  OBSERVATIONS,
  SOURCE_CHECKS,
  observationLabel,
  type ConclusionId,
  type EvidenceItem,
} from '@/data/activities/evidence-investigator';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { useShuffleNonce } from '@/hooks/use-shuffle';
import { seededShuffle } from '@/lib/shuffle';
import { playSound } from '@/lib/sound';
import { canSpeak, speak, stopSpeaking } from '@/lib/speech';
import { cn } from '@/lib/utils';
import type { ActivityResult } from '@/types/learner';

/**
 * AI Evidence Investigator.
 *
 * The habit being taught is a way of speaking: "it might be, because…" instead
 * of "definitely". So the activity refuses "definitely" answers outright, however
 * strong the observations — appearance alone cannot establish authorship, and a
 * child who is confidently right here has still reasoned badly.
 *
 * Screen 4 is the one that carries the lesson: after committing to a conclusion,
 * a child chooses what evidence would actually settle it. That is where the
 * answer stops being about how something looks.
 */

type Phase = 'inspect' | 'conclude' | 'sentence' | 'evidence' | 'feedback' | 'creation' | 'done';

interface RoundRecord {
  roundId: string;
  category: string;
  clues: string[];
  attempts: number;
  score: number;
}

export function EvidenceInvestigator({
  lessonKey,
  onFinish,
}: {
  lessonKey: string;
  onFinish: () => void;
}) {
  const { recordActivity, earnBadge } = useLearnerProgress();
  const { nonce } = useShuffleNonce();

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('inspect');
  const [observations, setObservations] = useState<string[]>([]);
  const [conclusion, setConclusion] = useState<ConclusionId | null>(null);
  const [checks, setChecks] = useState<string[]>([]);
  const [attempt, setAttempt] = useState(1);
  const [records, setRecords] = useState<RoundRecord[]>([]);
  const [zoom, setZoom] = useState(false);
  const [creation, setCreation] = useState<string | null>(null);
  const [madeIt, setMadeIt] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState<string | null>(null);
  const [best, setBest] = useState('');

  useEffect(() => () => stopSpeaking(), []);

  const item = EVIDENCE_ITEMS[index];
  if (!item) return null;

  const goodObservations = observations.filter((id) => item.relevant.includes(id)).length;
  const conclusionOk = conclusion !== null && item.acceptable.includes(conclusion);
  const goodChecks = checks.filter(
    (id) => SOURCE_CHECKS.find((check) => check.id === id)?.good,
  ).length;

  const sentence =
    conclusion === 'not-enough'
      ? 'I cannot tell who created this because the content alone does not provide enough reliable evidence.'
      : observations.length >= 2
        ? `It might be AI-generated because I noticed ${observationLabel(
            observations[0] ?? '',
          )} and ${observationLabel(
            observations[1] ?? '',
          )}. However, I cannot be completely certain from the content alone.`
        : `It might be AI-generated because I noticed ${observationLabel(
            observations[0] ?? '',
          )}. However, I cannot be completely certain from the content alone.`;

  const toggleObservation = (id: string) =>
    setObservations((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : current.length < 3
          ? [...current, id]
          : [...current.slice(1), id],
    );

  const chooseConclusion = (id: ConclusionId) => {
    setConclusion(id);
    // "Definitely" is refused from appearance alone, and sends the child back.
    if (id === 'definitely-ai' || id === 'definitely-human') {
      setAttempt((n) => n + 1);
      return;
    }
    setPhase('sentence');
  };

  const submitRound = () => {
    const score =
      (conclusionOk ? EVIDENCE_SCORING.conclusion : 0) +
      Math.min(2, goodObservations) * EVIDENCE_SCORING.observation +
      (goodChecks > 0 ? EVIDENCE_SCORING.sourceCheck : 0);

    const all = [
      ...records,
      {
        roundId: item.id,
        category: conclusion ?? 'none',
        clues: [...observations, ...checks],
        attempts: attempt,
        score,
      },
    ];
    setRecords(all);
    if (conclusionOk && goodObservations >= 2) setBest(sentence);
    setPhase('feedback');
    speak(feedbackMessage(item, conclusionOk, goodObservations));
  };

  const nextRound = () => {
    if (index === EVIDENCE_ITEMS.length - 1) {
      setPhase('creation');
      return;
    }
    setIndex(index + 1);
    setPhase('inspect');
    setObservations([]);
    setConclusion(null);
    setChecks([]);
    setAttempt(1);
    setZoom(false);
  };

  const finish = () => {
    const score = records.reduce((total, entry) => total + entry.score, 0);
    const result: ActivityResult = {
      key: `${lessonKey}#mission`,
      score,
      maxScore: EVIDENCE_SCORING.total,
      correctCategories: records.filter((entry) =>
        EVIDENCE_ITEMS.find((e) => e.id === entry.roundId)?.acceptable.includes(
          entry.category as ConclusionId,
        ),
      ).length,
      strongClues: records.reduce((total, entry) => total + entry.clues.length, 0),
      completed: true,
      rounds: [...records, { roundId: 'creation', category: creation ?? '', clues: [], attempts: 1, score: 0 }],
      updatedAt: new Date().toISOString(),
    };
    recordActivity(result);
    if (score >= EVIDENCE_SCORING.passMark) earnBadge(EVIDENCE_BADGE);
    setPhase('done');
  };

  // ---- the independent creation, after all six rounds ----
  if (phase === 'creation') {
    return (
      <Card>
        <Prompt text="Create something without step-by-step help." />
        <p className="mt-2 text-center text-ink-soft">
          No template, no example, no AI. Use paper, or a drawing app, or just your head.
        </p>

        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {CREATION_CHOICES.map((choice) => (
            <li key={choice.id}>
              <button
                type="button"
                onClick={() => setCreation(choice.id)}
                aria-pressed={creation === choice.id}
                className={cn(
                  'flex min-h-[96px] w-full flex-col items-center justify-center gap-2 rounded-card border-2 px-3 py-4 font-heading font-bold',
                  'transition-[transform,border-color,background-color] duration-200',
                  'hover:-translate-y-1 motion-reduce:hover:translate-y-0',
                  creation === choice.id
                    ? 'border-primary bg-primary text-white shadow-button'
                    : 'border-border-soft bg-surface hover:border-primary hover:bg-primary-surface',
                )}
              >
                <span className="text-3xl" aria-hidden="true">
                  {choice.emoji}
                </span>
                {choice.label}
              </button>
            </li>
          ))}
        </ul>

        {creation && !madeIt ? (
          <div className="mt-5 rounded-card border-2 border-dashed border-primary/40 bg-primary-surface/40 p-5">
            {/* Blank on purpose. The spec forbids a template, an example or an
                AI-generated starting point — the whole point is that the child
                made it. */}
            {creation === 'story' ? (
              <WritingBox label="Write your four-sentence story" sentences={4} />
            ) : (
              <>
                <DrawingCanvas
                  label={
                    creation === 'draw' ? 'Drawing area for your creature' : 'Design your game character'
                  }
                />
                <RotateHint />
              </>
            )}

            <Button size="lg" onClick={() => setMadeIt(true)} className="mt-4 w-full">
              I made this myself
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          </div>
        ) : null}

        {madeIt ? (
          <div className="mt-6">
            <Prompt text="Could someone know for certain how this was created just by looking at it?" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { id: 'yes', label: 'Yes, always', emoji: '👀' },
                { id: 'no', label: 'No, they would need more evidence', emoji: '🔎' },
              ].map((option) => {
                const picked = finalAnswer === option.id;
                const reveal = finalAnswer !== null && option.id === 'no';
                return (
                  <li key={option.id}>
                    <button
                      type="button"
                      onClick={() => !finalAnswer && setFinalAnswer(option.id)}
                      disabled={finalAnswer !== null}
                      className={cn(
                        'flex min-h-[72px] w-full items-center justify-center gap-3 rounded-card border-2 px-4 font-heading font-bold',
                        'transition-colors duration-200 disabled:cursor-default',
                        reveal
                          ? 'border-grass bg-grass-light'
                          : picked
                            ? 'border-coral bg-coral/10'
                            : 'border-border-soft bg-surface',
                      )}
                    >
                      <span className="text-2xl" aria-hidden="true">
                        {option.emoji}
                      </span>
                      {option.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            {finalAnswer ? (
              <div role="status" className="mt-5 rounded-card bg-primary-surface p-5">
                <p className="text-lg leading-relaxed">
                  You just made something yourself — and even <em>you</em> could not prove it by
                  showing someone the result. This is why careful detectives ask about the source and
                  the creation process instead of relying only on appearance.
                </p>
                <Button size="lg" onClick={finish} className="mt-4 w-full">
                  See my badge
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Card>
    );
  }

  if (phase === 'done') {
    const score = records.reduce((total, entry) => total + entry.score, 0);
    const passed = score >= EVIDENCE_SCORING.passMark;

    return (
      <Card
        role="status"
        className={cn('text-center', passed ? 'border-grass bg-grass-light' : 'bg-sunshine-light')}
      >
        <span className="block text-6xl motion-safe:animate-float" aria-hidden="true">
          {passed ? '🕵️' : '💪'}
        </span>
        <h3 className="mt-2 font-heading text-2xl font-bold">Investigation complete!</h3>
        <p className="mt-2 font-heading text-xl font-bold text-grass-dark">
          {score} out of {EVIDENCE_SCORING.total} points
        </p>
        <p className="mx-auto mt-3 max-w-lg text-lg leading-relaxed">
          You learned to examine clues, avoid overconfident claims, and ask for stronger evidence
          before deciding whether something was created with AI.
        </p>

        {best ? (
          <p className="mx-auto mt-4 max-w-lg rounded-card bg-surface p-4 text-left font-heading leading-relaxed">
            <span className="block text-xs font-bold uppercase tracking-wide text-ink-muted">
              Your strongest sentence
            </span>
            {best}
          </p>
        ) : null}

        {passed ? (
          <p className="mt-5 inline-flex items-center gap-3 rounded-card border-2 border-grass bg-surface px-5 py-3">
            <span className="text-3xl motion-safe:animate-twinkle" aria-hidden="true">
              🕵️
            </span>
            <span className="text-left">
              <span className="block font-heading font-bold">Evidence Investigator</span>
              <span className="block text-xs text-ink-muted">Badge earned</span>
            </span>
          </p>
        ) : null}

        <div className="mt-6">
          <Button size="lg" onClick={onFinish}>
            On to the quiz
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <p className="font-heading font-bold">
          Item {index + 1} of {EVIDENCE_ITEMS.length}
        </p>
        <p className="text-sm font-bold text-ink-muted">{item.title}</p>
      </div>
      <ProgressBar
        value={index}
        max={EVIDENCE_ITEMS.length}
        label="Investigation progress"
        className="mt-2"
      />

      <Prompt text="Study the mystery item carefully." />
      <Exhibit item={item} zoom={zoom} onZoom={() => setZoom((on) => !on)} />

      {phase === 'inspect' ? (
        <>
          <Prompt text="What do you notice?" />
          <p className="mt-1 text-center text-sm font-bold text-ink-muted" aria-live="polite">
            {observations.length} of 3 chosen
          </p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {seededShuffle(OBSERVATIONS, `${item.id}:${nonce}`).map((card) => {
              const picked = observations.includes(card.id);
              return (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() => toggleObservation(card.id)}
                    aria-pressed={picked}
                    className={cn(
                      'flex min-h-[56px] items-center gap-2 rounded-button border-2 px-4 text-base font-semibold',
                      'transition-[transform,border-color,background-color] duration-200',
                      'hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
                      picked
                        ? 'border-primary bg-primary text-white shadow-button'
                        : 'border-border-soft bg-surface text-ink hover:border-primary/50 hover:bg-primary-surface',
                    )}
                  >
                    <span className="text-xl" aria-hidden="true">
                      {card.emoji}
                    </span>
                    {card.label}
                    {picked ? <Check className="size-4" aria-hidden="true" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>

          {observations.length > 0 ? (
            <Button size="lg" onClick={() => setPhase('conclude')} className="mt-5 w-full">
              Make my claim
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          ) : null}
        </>
      ) : null}

      {phase === 'conclude' ? (
        <>
          <Prompt text="What is the most careful conclusion?" />
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {CONCLUSIONS.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  onClick={() => chooseConclusion(option.id)}
                  className="flex min-h-[80px] w-full items-center gap-3 rounded-card border-2 border-border-soft bg-surface px-4 py-3 text-left font-heading font-bold transition-[transform,border-color,background-color] duration-200 hover:-translate-y-1 hover:border-primary hover:bg-primary-surface motion-reduce:hover:translate-y-0"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {option.emoji}
                  </span>
                  {option.label}
                </button>
              </li>
            ))}
          </ul>

          {/* "Definitely" is refused rather than scored — the point of the lesson. */}
          {conclusion === 'definitely-ai' ? (
            <p role="alert" className="mt-4 rounded-card bg-sunshine-light p-5 text-lg leading-relaxed">
              That is possible, but the appearance alone cannot prove it. Try using &ldquo;It might
              be AI-generated because…&rdquo;
            </p>
          ) : null}
          {conclusion === 'definitely-human' ? (
            <p role="alert" className="mt-4 rounded-card bg-sunshine-light p-5 text-lg leading-relaxed">
              A human may have created it, but we still need stronger evidence before saying
              &ldquo;definitely&rdquo;.
            </p>
          ) : null}
        </>
      ) : null}

      {phase === 'sentence' ? (
        <div className="mt-6">
          <div className="flex items-center gap-3 rounded-card bg-primary-surface p-5">
            <p className="flex-1 font-heading text-lg font-bold leading-relaxed">{sentence}</p>
            {canSpeak() ? (
              <button
                type="button"
                onClick={() => speak(sentence)}
                aria-label="Hear my explanation"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-105 motion-reduce:hover:scale-100"
              >
                <Volume2 className="size-6" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setPhase('inspect');
                setConclusion(null);
              }}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Change my evidence
            </Button>
            <Button size="lg" onClick={() => setPhase('evidence')} className="flex-1">
              Submit conclusion
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}

      {phase === 'evidence' ? (
        <>
          <Prompt text="What evidence would help us know more reliably?" />
          <ul className="mt-4 flex flex-wrap gap-2">
            {seededShuffle(SOURCE_CHECKS, `checks:${item.id}:${nonce}`).map((check) => {
              const picked = checks.includes(check.id);
              return (
                <li key={check.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setChecks((current) =>
                        current.includes(check.id)
                          ? current.filter((id) => id !== check.id)
                          : [...current, check.id],
                      )
                    }
                    aria-pressed={picked}
                    className={cn(
                      'flex min-h-[56px] items-center gap-2 rounded-button border-2 px-4 text-base font-semibold',
                      'transition-[transform,border-color,background-color] duration-200',
                      'hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
                      picked
                        ? 'border-primary bg-primary text-white shadow-button'
                        : 'border-border-soft bg-surface text-ink hover:border-primary/50 hover:bg-primary-surface',
                    )}
                  >
                    <span className="text-xl" aria-hidden="true">
                      {check.emoji}
                    </span>
                    {check.label}
                    {picked ? <Check className="size-4" aria-hidden="true" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>

          {checks.length > 0 ? (
            <Button size="lg" onClick={submitRound} className="mt-5 w-full">
              Finish this item
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          ) : null}
        </>
      ) : null}

      {phase === 'feedback' ? (
        <div
          role="status"
          className={cn(
            'mt-6 rounded-card p-5',
            conclusionOk && goodObservations >= 2 ? 'bg-grass-light' : 'bg-sunshine-light',
          )}
        >
          <p className="font-heading text-lg font-bold">
            {feedbackMessage(item, conclusionOk, goodObservations)}
          </p>
          <p className="mt-3 rounded-card bg-surface p-4 leading-relaxed">
            <span className="font-heading font-bold">What was true: </span>
            {item.truth}
          </p>
          <p className="mt-2 leading-relaxed text-ink-soft">{item.teaching}</p>

          <Button size="lg" onClick={nextRound} className="mt-4 w-full">
            {index === EVIDENCE_ITEMS.length - 1 ? 'Now make something yourself' : 'Next item'}
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

function feedbackMessage(item: EvidenceItem, conclusionOk: boolean, goodObservations: number) {
  if (!conclusionOk) {
    return 'Good detective work. Sometimes the most accurate answer is that we do not have enough evidence.';
  }
  if (goodObservations < 2) {
    return 'Look again. Choose clues connected to the image, words, sound, lighting, details, or creation source.';
  }
  return 'Excellent investigation! You noticed useful clues without claiming more than the evidence proves.';
}

function Exhibit({
  item,
  zoom,
  onZoom,
}: {
  item: EvidenceItem;
  zoom: boolean;
  onZoom: () => void;
}) {
  return (
    <div className="mt-4">
      <div
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-card bg-primary-surface p-6 transition-all duration-300',
          zoom ? 'min-h-[300px]' : 'min-h-[200px]',
        )}
      >
        {item.kind === 'text' ? (
          <p className="whitespace-pre-line text-center font-heading text-lg italic leading-relaxed sm:text-xl">
            &ldquo;{item.display}&rdquo;
          </p>
        ) : (
          <span
            aria-hidden="true"
            className={cn('leading-none transition-all duration-300', zoom ? 'text-[11rem]' : 'text-[7rem] sm:text-[9rem]')}
          >
            {item.display}
          </span>
        )}
        <span className="sr-only">{item.label}</span>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {item.kind === 'image' ? (
          <Button variant="ghost" size="sm" onClick={onZoom}>
            <Search className="size-4" aria-hidden="true" />
            {zoom ? 'Zoom out' : 'Zoom in'}
          </Button>
        ) : null}
        {item.kind === 'audio' ? (
          <Button variant="ghost" size="sm" onClick={() => playSound('beep')}>
            <Volume2 className="size-4" aria-hidden="true" />
            Replay the clip
          </Button>
        ) : null}
        {item.kind === 'text' && canSpeak() ? (
          <Button variant="ghost" size="sm" onClick={() => speak(item.display)}>
            <Volume2 className="size-4" aria-hidden="true" />
            Read it aloud
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function Prompt({ text }: { text: string }) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2 text-center">
      <h3 className="font-heading text-xl font-bold sm:text-2xl">{text}</h3>
      {canSpeak() ? (
        <button
          type="button"
          onClick={() => speak(text)}
          aria-label="Read this out loud"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-surface text-primary-dark transition-colors hover:bg-primary-light"
        >
          <Volume2 className="size-5" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
