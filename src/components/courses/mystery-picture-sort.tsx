'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowRight, Check, Expand, RotateCcw, Star, Volume2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import {
  CATEGORIES,
  CLUE_CARDS,
  SCORING,
  SORT_ROUNDS,
  categoryLabel,
  clueLabel,
  type CategoryId,
  type SortRound,
} from '@/data/activities/mystery-picture-sort';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { useShuffleNonce } from '@/hooks/use-shuffle';
import { img } from '@/lib/images';
import { canSpeak, speak, stopSpeaking } from '@/lib/speech';
import { seededShuffle } from '@/lib/shuffle';
import { cn } from '@/lib/utils';
import type { ActivityResult } from '@/types/learner';

/**
 * Mystery Picture Sort.
 *
 * The lesson's objective is not "pick the right folder" — it is "use at least
 * two visible features to justify a category". So each round is answered twice:
 * the category, then the evidence. The platform assembles the sentence itself,
 * because the thing being assessed is the reasoning, and asking a nine-year-old
 * to type it would measure their spelling instead.
 *
 * Nothing here goes red. A wrong answer earns an encouraging message and a
 * retry; the correct answer is only revealed after the second attempt, so the
 * first mistake is still a chance to think rather than a verdict.
 */

type Phase = 'category' | 'clues' | 'review' | 'feedback';

interface RoundRecord {
  roundId: string;
  category: string;
  clues: string[];
  attempts: number;
  score: number;
}

interface Outcome {
  categoryCorrect: boolean;
  goodClues: number;
  stars: number;
  score: number;
  message: string;
  /** Reveal the answer only once a retry has been used. */
  reveal: boolean;
  canRetry: boolean;
}

function judge(round: SortRound, category: CategoryId, clues: string[], attempt: number): Outcome {
  const categoryCorrect = category === round.answer;
  const goodClues = clues.filter((clue) => round.relevantClues.includes(clue)).length;

  const score =
    (categoryCorrect ? SCORING.category : 0) +
    goodClues * SCORING.firstClue +
    SCORING.explanation;

  if (categoryCorrect && goodClues === 2) {
    return {
      categoryCorrect,
      goodClues,
      stars: 3,
      score,
      message:
        round.answer === 'unsure'
          ? 'Great decision! Careful detectives do not guess when the picture does not provide enough evidence.'
          : 'Excellent detective work! Your answer matches the picture, and both clues support your choice.',
      reveal: false,
      canRetry: false,
    };
  }

  if (categoryCorrect) {
    return {
      categoryCorrect,
      goodClues,
      stars: 2,
      score,
      message: 'Good choice! One clue helped, but look again for a stronger second clue.',
      reveal: attempt >= 2,
      canRetry: attempt < 2,
    };
  }

  return {
    categoryCorrect,
    goodClues,
    stars: goodClues > 0 ? 1 : 0,
    score,
    message:
      attempt >= 2
        ? `The best answer is ${categoryLabel(round.answer)} because we can see ${clueLabel(
            round.bestClues[0],
          )} and ${clueLabel(round.bestClues[1])}.`
        : 'Good observation. Your clues are visible, but they may point to a different folder. Compare the ears, tail, feet, and body shape again.',
    reveal: attempt >= 2,
    canRetry: attempt < 2,
  };
}

export function MysteryPictureSort({
  lessonKey,
  onFinish,
}: {
  lessonKey: string;
  onFinish: () => void;
}) {
  const { recordActivity, earnBadge } = useLearnerProgress();

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('category');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [clues, setClues] = useState<string[]>([]);
  const [attempt, setAttempt] = useState(1);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [records, setRecords] = useState<RoundRecord[]>([]);
  const [done, setDone] = useState(false);
  const { nonce } = useShuffleNonce();

  const round = SORT_ROUNDS[index];

  useEffect(() => () => stopSpeaking(), []);

  if (!round) return null;

  // Fresh order every round and every visit, so nobody learns a position.
  const folders = [
    ...seededShuffle(
      CATEGORIES.filter((option) => option.id !== 'unsure'),
      `${round.id}:${nonce}`,
    ),
    ...CATEGORIES.filter((option) => option.id === 'unsure'),
  ];
  const clueCards = seededShuffle(CLUE_CARDS, `clues:${round.id}:${nonce}`);

  const sentence =
    category && clues.length === 2
      ? `I chose ${categoryLabel(category)} because I noticed ${clueLabel(
          clues[0] ?? '',
        )} and ${clueLabel(clues[1] ?? '')}.`
      : '';

  const toggleClue = (id: string) =>
    setClues((current) => {
      if (current.includes(id)) return current.filter((clue) => clue !== id);
      // Exactly two: picking a third replaces the oldest, so a child is never
      // stuck having to deselect before choosing.
      return current.length < 2 ? [...current, id] : [current[1]!, id];
    });

  const submit = () => {
    if (!category || clues.length !== 2) return;
    const result = judge(round, category, clues, attempt);
    setOutcome(result);
    setPhase('feedback');
    if (result.message) speak(result.message);
  };

  const retry = () => {
    setAttempt(2);
    setOutcome(null);
    setClues([]);
    setCategory(null);
    setPhase('category');
  };

  const nextRound = () => {
    if (!outcome || !category) return;

    const record: RoundRecord = {
      roundId: round.id,
      category,
      clues,
      attempts: attempt,
      score: outcome.score,
    };
    const all = [...records, record];
    setRecords(all);

    if (index === SORT_ROUNDS.length - 1) {
      finish(all);
      return;
    }

    setIndex(index + 1);
    setPhase('category');
    setCategory(null);
    setClues([]);
    setAttempt(1);
    setOutcome(null);
  };

  const finish = (all: RoundRecord[]) => {
    const score = all.reduce((total, entry) => total + entry.score, 0);
    const correctCategories = all.filter((entry, i) => entry.category === SORT_ROUNDS[i]?.answer)
      .length;
    const strongClues = all.reduce((total, entry, i) => {
      const relevant = SORT_ROUNDS[i]?.relevantClues ?? [];
      return total + entry.clues.filter((clue) => relevant.includes(clue)).length;
    }, 0);

    const result: ActivityResult = {
      key: lessonKey,
      score,
      maxScore: SCORING.total,
      correctCategories,
      strongClues,
      completed: true,
      rounds: all,
      updatedAt: new Date().toISOString(),
    };
    recordActivity(result);
    if (score >= SCORING.passMark) earnBadge('ai-detective-academy-picture-clue-patrol');
    setDone(true);
  };

  if (done) {
    return <Completion records={records} onFinish={onFinish} />;
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <p className="font-heading font-bold">
          Round {index + 1} of {SORT_ROUNDS.length}
        </p>
        {attempt > 1 ? <p className="text-sm font-bold text-sunshine-dark">Second try</p> : null}
      </div>
      <ProgressBar
        value={index}
        max={SORT_ROUNDS.length}
        label="Mystery Picture Sort progress"
        className="mt-2"
      />

      <Prompt
        text={
          phase === 'category'
            ? 'Which folder should this picture go into?'
            : phase === 'clues'
              ? 'Choose two clues that helped you decide.'
              : phase === 'review'
                ? 'Is this right?'
                : 'Here is what I noticed.'
        }
      />

      <Picture round={round} highlight={outcome?.reveal ? round.bestClues : undefined} />

      {phase === 'category' ? (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {folders.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => {
                  setCategory(option.id);
                  setPhase('clues');
                }}
                className="flex min-h-[80px] w-full items-center justify-center gap-3 rounded-card border-2 border-border-soft bg-surface px-4 text-lg font-heading font-bold transition-[transform,border-color,background-color] duration-200 hover:-translate-y-1 hover:border-primary hover:bg-primary-surface motion-reduce:hover:translate-y-0"
              >
                <span className="text-3xl" aria-hidden="true">
                  {option.emoji}
                </span>
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {phase === 'clues' ? (
        <>
          <ul className="mt-6 flex flex-wrap gap-2">
            {clueCards.map((clue) => {
              const picked = clues.includes(clue.id);
              return (
                <li key={clue.id}>
                  <button
                    type="button"
                    onClick={() => toggleClue(clue.id)}
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
                      {clue.emoji}
                    </span>
                    {clue.label}
                    {picked ? <Check className="size-4" aria-hidden="true" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 text-center font-bold text-ink-muted" aria-live="polite">
            {clues.length} of 2 clues chosen
          </p>

          {clues.length === 2 ? (
            <Button size="lg" onClick={() => setPhase('review')} className="mt-4 w-full">
              See my sentence
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          ) : null}
        </>
      ) : null}

      {phase === 'review' ? (
        <div className="mt-6">
          <Sentence text={sentence} />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setPhase('category');
                setCategory(null);
                setClues([]);
              }}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Change my answer
            </Button>
            <Button size="lg" onClick={submit} className="flex-1">
              Submit answer
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}

      {phase === 'feedback' && outcome ? (
        <div
          role="status"
          className={cn(
            'mt-6 rounded-card p-5',
            outcome.stars === 3 ? 'bg-grass-light' : 'bg-sunshine-light',
          )}
        >
          <Stars count={outcome.stars} />
          <p className="mt-3 text-lg leading-relaxed">{outcome.message}</p>

          {outcome.reveal || outcome.stars === 3 ? (
            <p className="mt-3 rounded-card bg-surface p-4 leading-relaxed">{round.teaching}</p>
          ) : null}

          <Sentence text={sentence} className="mt-4" />

          <div className="mt-4 flex flex-wrap gap-3">
            {outcome.canRetry ? (
              <Button size="lg" onClick={retry} className="flex-1">
                <RotateCcw className="size-5" aria-hidden="true" />
                Have another look
              </Button>
            ) : (
              <Button size="lg" onClick={nextRound} className="flex-1">
                {index === SORT_ROUNDS.length - 1 ? 'See my score' : 'Next picture'}
                <ArrowRight className="size-5" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </Card>
  );
}

/** Every instruction can be read aloud — many nine-year-olds are still decoding. */
function Prompt({ text }: { text: string }) {
  return (
    <div className="mt-5 flex items-center justify-center gap-2 text-center">
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

function Picture({ round, highlight }: { round: SortRound; highlight?: readonly string[] }) {
  const [full, setFull] = useState(false);

  // Escape closes it, as a dialog must.
  useEffect(() => {
    if (!full) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFull(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [full]);

  const treatment = cn(
    round.treatment === 'blur' && 'blur-[7px]',
    round.treatment === 'peek' && '[clip-path:inset(0_0_55%_0)]',
  );

  return (
    <div className="mt-5">
      {full ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={round.label}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-6"
          onClick={() => setFull(false)}
        >
          <span aria-hidden="true" className={cn('text-[14rem] leading-none sm:text-[20rem]', treatment)}>
            {round.emoji}
          </span>
          <button
            type="button"
            onClick={() => setFull(false)}
            autoFocus
            className="absolute right-4 top-4 flex min-h-[44px] items-center gap-2 rounded-button bg-surface px-4 font-bold text-ink"
          >
            <X className="size-5" aria-hidden="true" />
            Close
          </button>
        </div>
      ) : null}

      <div className="relative flex min-h-[200px] items-center justify-center overflow-hidden rounded-card bg-primary-surface p-6">
        <span
          aria-hidden="true"
          className={cn(
            'text-[7rem] leading-none sm:text-[9rem]',
            round.treatment === 'blur' && 'blur-[7px]',
            round.treatment === 'peek' && '[clip-path:inset(0_0_55%_0)]',
            !round.treatment && 'motion-safe:animate-float',
          )}
        >
          {round.emoji}
        </span>

        {/* The costume round needs fake ears drawn on, not a filter. */}
        {round.treatment === 'costume' ? (
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-6 -translate-x-1/2 text-4xl sm:text-5xl"
          >
            🎀
          </span>
        ) : null}

        <span className="sr-only">{round.label}</span>
      </div>

      <div className="mt-2 text-center">
        <Button variant="ghost" size="sm" onClick={() => setFull(true)}>
          <Expand className="size-4" aria-hidden="true" />
          View full screen
        </Button>
      </div>

      {highlight ? (
        <p className="mt-3 rounded-card bg-primary-surface px-4 py-3 text-center">
          <span className="font-heading font-bold">Look here: </span>
          {highlight.map((clue) => clueLabel(clue)).join(' and ')}
        </p>
      ) : null}
    </div>
  );
}

function Sentence({ text, className }: { text: string; className?: string }) {
  if (!text) return null;

  return (
    <div className={cn('flex items-center gap-3 rounded-card bg-surface p-4', className)}>
      <p className="flex-1 font-heading text-lg font-bold leading-relaxed">{text}</p>
      {canSpeak() ? (
        <button
          type="button"
          onClick={() => speak(text)}
          aria-label="Hear my sentence"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-105 motion-reduce:hover:scale-100"
        >
          <Volume2 className="size-6" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <p className="flex justify-center gap-1">
      <span className="sr-only">{count} out of 3 stars</span>
      {[1, 2, 3].map((star) => (
        <Star
          key={star}
          aria-hidden="true"
          className={cn(
            'size-8',
            star <= count ? 'fill-sunshine text-sunshine-dark' : 'text-border-soft',
          )}
        />
      ))}
    </p>
  );
}

function Completion({ records, onFinish }: { records: RoundRecord[]; onFinish: () => void }) {
  const score = records.reduce((total, entry) => total + entry.score, 0);
  const correct = records.filter((entry, i) => entry.category === SORT_ROUNDS[i]?.answer).length;
  const strongClues = records.reduce((total, entry, i) => {
    const relevant = SORT_ROUNDS[i]?.relevantClues ?? [];
    return total + entry.clues.filter((clue) => relevant.includes(clue)).length;
  }, 0);
  const passed = score >= SCORING.passMark;

  // One message, aimed at whichever part was weakest.
  const improvement =
    correct < SORT_ROUNDS.length - 2
      ? 'Next time, compare the ears and the tail before you choose a folder — they separate cats, dogs and rabbits fastest.'
      : strongClues < records.length * 2 - 2
        ? 'Your folders were good! Try picking clues you can actually point at in the picture.'
        : 'You matched the picture and the evidence almost every time. That is exactly how a classifier should work.';

  return (
    <Card role="status" className={cn('text-center', passed ? 'border-grass bg-grass-light' : 'bg-sunshine-light')}>
      <span className="block text-6xl motion-safe:animate-float" aria-hidden="true">
        {passed ? '🎉' : '💪'}
      </span>
      <h3 className="mt-2 font-heading text-2xl font-bold">
        You completed the Mystery Picture Sort!
      </h3>

      <dl className="mx-auto mt-5 grid max-w-md grid-cols-3 gap-3">
        {[
          { label: 'Score', value: `${score}` },
          { label: 'Right folders', value: `${correct} / ${SORT_ROUNDS.length}` },
          { label: 'Strong clues', value: `${strongClues}` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-card bg-surface p-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-muted">
              {stat.label}
            </dt>
            <dd className="mt-1 font-heading text-2xl font-bold">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed">
        You used visual evidence to classify pictures and learned that &ldquo;Need More
        Information&rdquo; can be a smart answer.
      </p>
      <p className="mx-auto mt-3 max-w-lg leading-relaxed text-ink-soft">{improvement}</p>

      {passed ? (
        <p className="mt-5 inline-flex items-center gap-3 rounded-card border-2 border-grass bg-surface px-5 py-3">
          <span className="text-3xl motion-safe:animate-twinkle" aria-hidden="true">
            🔍
          </span>
          <span className="text-left">
            <span className="block font-heading font-bold">Pixel Detective</span>
            <span className="block text-xs text-ink-muted">Badge earned</span>
          </span>
        </p>
      ) : (
        <p className="mt-5 text-ink-soft">
          Score {SCORING.passMark} to earn the Pixel Detective badge — have another go whenever you
          like.
        </p>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={onFinish}>
          Next
          <ArrowRight className="size-5" aria-hidden="true" />
        </Button>
      </div>

      <Image
        {...img('rewards/xp-coin.webp')}
        alt=""
        aria-hidden="true"
        sizes="48px"
        className="mx-auto mt-4 size-8 object-contain"
      />
    </Card>
  );
}
