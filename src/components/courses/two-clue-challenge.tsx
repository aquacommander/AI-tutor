'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import {
  ANIMALS,
  CHALLENGE_CLUES,
  CHALLENGE_SCORING,
  TWO_CLUE_BADGE,
  animalLabel,
  challengeClueLabel,
  pickThree,
  type AnimalId,
  type ChallengePicture,
} from '@/data/activities/two-clue-challenge';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { useShuffleNonce } from '@/hooks/use-shuffle';
import { canSpeak, speak, stopSpeaking } from '@/lib/speech';
import { seededShuffle } from '@/lib/shuffle';
import { cn } from '@/lib/utils';
import type { ActivityResult } from '@/types/learner';

/**
 * Two-Clue Animal Challenge — the independent mission for Lesson 1.
 *
 * Three pictures from a pool of twelve, chosen at random, so a child who repeats
 * the lesson does not simply replay a memorised sequence.
 *
 * The randomisation happens after mount rather than during render. Picking on
 * the server would produce different markup from the client's first render, and
 * React would throw a hydration mismatch.
 */

type Phase = 'animal' | 'clues' | 'review' | 'feedback';

interface RoundRecord {
  roundId: string;
  category: string;
  clues: string[];
  attempts: number;
  score: number;
}

interface Outcome {
  correct: boolean;
  goodClues: number;
  score: number;
  message: string;
  reveal: boolean;
  canRetry: boolean;
}

function judge(
  picture: ChallengePicture,
  animal: AnimalId,
  clues: string[],
  attempt: number,
): Outcome {
  const correct = animal === picture.answer;
  const goodClues = clues.filter((clue) => picture.relevantClues.includes(clue)).length;
  const score =
    (correct ? CHALLENGE_SCORING.animal : 0) +
    goodClues * CHALLENGE_SCORING.clue +
    CHALLENGE_SCORING.explanation;

  if (correct && goodClues === 2) {
    return {
      correct,
      goodClues,
      score,
      message:
        picture.answer === 'unsure'
          ? 'Smart choice! Good detectives do not guess when the evidence is unclear.'
          : 'Excellent! You used two strong clues to explain your choice.',
      reveal: true,
      canRetry: false,
    };
  }

  if (correct) {
    return {
      correct,
      goodClues,
      score,
      message: 'Good start. One clue is helpful. Look again and choose a stronger second clue.',
      reveal: attempt >= 2,
      canRetry: attempt < 2,
    };
  }

  return {
    correct,
    goodClues,
    score,
    message:
      attempt >= 2
        ? `The answer is ${animalLabel(picture.answer)} — look at the ${challengeClueLabel(
            picture.bestClues[0],
          )} and the ${challengeClueLabel(picture.bestClues[1])}.`
        : 'Nice investigating. Compare the animal’s ears, tail, feet, and body shape before trying again.',
    reveal: attempt >= 2,
    canRetry: attempt < 2,
  };
}

export function TwoClueChallenge({
  lessonKey,
  onFinish,
}: {
  lessonKey: string;
  onFinish: () => void;
}) {
  const { recordActivity, earnBadge } = useLearnerProgress();

  const [pictures, setPictures] = useState<ChallengePicture[] | null>(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('animal');
  const [animal, setAnimal] = useState<AnimalId | null>(null);
  const [clues, setClues] = useState<string[]>([]);
  const [attempt, setAttempt] = useState(1);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [records, setRecords] = useState<RoundRecord[]>([]);
  const [done, setDone] = useState(false);
  const { nonce } = useShuffleNonce();

  useEffect(() => setPictures(pickThree()), []);
  useEffect(() => () => stopSpeaking(), []);

  if (!pictures) {
    return (
      <Card>
        <div className="h-64 animate-pulse rounded-card bg-primary-surface/50" />
        <span className="sr-only">Choosing your pictures</span>
      </Card>
    );
  }

  const picture = pictures[index];
  if (!picture) return null;

  const animalCards = [
    ...seededShuffle(
      ANIMALS.filter((option) => option.id !== 'unsure'),
      `${picture.id}:${nonce}`,
    ),
    ...ANIMALS.filter((option) => option.id === 'unsure'),
  ];
  const clueCards = seededShuffle(CHALLENGE_CLUES, `clues:${picture.id}:${nonce}`);

  const sentence =
    animal && clues.length === 2
      ? `I chose ${animalLabel(animal)} because I noticed ${challengeClueLabel(
          clues[0] ?? '',
        )} and ${challengeClueLabel(clues[1] ?? '')}.`
      : '';

  const toggleClue = (id: string) =>
    setClues((current) => {
      if (current.includes(id)) return current.filter((clue) => clue !== id);
      // Exactly two: a third replaces the oldest, so nobody gets stuck.
      return current.length < 2 ? [...current, id] : [current[1]!, id];
    });

  const submit = () => {
    if (!animal || clues.length !== 2) return;
    const result = judge(picture, animal, clues, attempt);
    setOutcome(result);
    setPhase('feedback');
    speak(result.message);
  };

  const retry = () => {
    setAttempt(2);
    setOutcome(null);
    setAnimal(null);
    setClues([]);
    setPhase('animal');
  };

  const advance = () => {
    if (!outcome || !animal) return;

    const all = [
      ...records,
      { roundId: picture.id, category: animal, clues, attempts: attempt, score: outcome.score },
    ];
    setRecords(all);

    if (index === pictures.length - 1) {
      const score = all.reduce((total, entry) => total + entry.score, 0);
      const result: ActivityResult = {
        key: `${lessonKey}#mission`,
        score,
        maxScore: CHALLENGE_SCORING.total,
        correctCategories: all.filter((entry, i) => entry.category === pictures[i]?.answer).length,
        strongClues: all.reduce((total, entry, i) => {
          const relevant = pictures[i]?.relevantClues ?? [];
          return total + entry.clues.filter((clue) => relevant.includes(clue)).length;
        }, 0),
        completed: true,
        rounds: all,
        updatedAt: new Date().toISOString(),
      };
      recordActivity(result);
      if (score >= CHALLENGE_SCORING.passMark) earnBadge(TWO_CLUE_BADGE);
      setDone(true);
      return;
    }

    setIndex(index + 1);
    setPhase('animal');
    setAnimal(null);
    setClues([]);
    setAttempt(1);
    setOutcome(null);
  };

  if (done) {
    const score = records.reduce((total, entry) => total + entry.score, 0);
    const correct = records.filter((entry, i) => entry.category === pictures[i]?.answer).length;
    const passed = score >= CHALLENGE_SCORING.passMark;

    return (
      <Card
        role="status"
        className={cn('text-center', passed ? 'border-grass bg-grass-light' : 'bg-sunshine-light')}
      >
        <span className="block text-6xl motion-safe:animate-float" aria-hidden="true">
          {passed ? '⭐' : '💪'}
        </span>
        <h3 className="mt-2 font-heading text-2xl font-bold">Challenge complete!</h3>
        <p className="mt-2 font-heading text-xl font-bold text-grass-dark">
          {score} out of {CHALLENGE_SCORING.total} points
        </p>
        <p className="mt-1 text-ink-soft">
          {correct} of {pictures.length} animals named correctly
        </p>

        {passed ? (
          <p className="mt-5 inline-flex items-center gap-3 rounded-card border-2 border-grass bg-surface px-5 py-3">
            <span className="text-3xl motion-safe:animate-twinkle" aria-hidden="true">
              ⭐
            </span>
            <span className="text-left">
              <span className="block font-heading font-bold">Two-Clue Detective Star</span>
              <span className="block text-xs text-ink-muted">Badge earned</span>
            </span>
          </p>
        ) : (
          <p className="mt-4 text-ink-soft">
            Score {CHALLENGE_SCORING.passMark} to earn the Two-Clue Detective Star. New pictures
            every time you play!
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              setPictures(pickThree());
              setRecords([]);
              setIndex(0);
              setPhase('animal');
              setAnimal(null);
              setClues([]);
              setAttempt(1);
              setOutcome(null);
              setDone(false);
            }}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Three new pictures
          </Button>
          <Button size="lg" onClick={onFinish}>
            On to the quiz
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </Card>
    );
  }

  const prompt =
    phase === 'animal'
      ? 'What animal do you think this is?'
      : phase === 'clues'
        ? 'Which two clues helped you decide?'
        : phase === 'review'
          ? 'Here is your answer.'
          : 'Let us see.';

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <p className="font-heading font-bold">
          Picture {index + 1} of {pictures.length}
        </p>
        {attempt > 1 ? <p className="text-sm font-bold text-sunshine-dark">Second try</p> : null}
      </div>
      <ProgressBar
        value={index}
        max={pictures.length}
        label="Two-Clue Challenge progress"
        className="mt-2"
      />

      <div className="mt-5 flex items-center justify-center gap-2 text-center">
        <h3 className="font-heading text-xl font-bold sm:text-2xl">{prompt}</h3>
        {canSpeak() ? (
          <button
            type="button"
            onClick={() => speak(prompt)}
            aria-label="Read this out loud"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-surface text-primary-dark transition-colors hover:bg-primary-light"
          >
            <Volume2 className="size-5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="relative mt-5 flex min-h-[200px] items-center justify-center overflow-hidden rounded-card bg-primary-surface p-6">
        <span
          aria-hidden="true"
          className={cn(
            'text-[7rem] leading-none sm:text-[9rem]',
            picture.treatment === 'blur' && 'blur-[7px]',
            picture.treatment === 'peek' && '[clip-path:inset(0_0_55%_0)]',
            !picture.treatment && 'motion-safe:animate-float',
          )}
        >
          {picture.emoji}
        </span>
        {picture.treatment === 'costume' ? (
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-6 -translate-x-1/2 text-4xl sm:text-5xl"
          >
            🎀
          </span>
        ) : null}
        <span className="sr-only">{picture.label}</span>
      </div>

      {phase === 'animal' ? (
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {animalCards.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => {
                  setAnimal(option.id);
                  setPhase('clues');
                }}
                className={cn(
                  'flex min-h-[80px] w-full flex-col items-center justify-center gap-1 rounded-card border-2 border-border-soft bg-surface px-3 py-3',
                  'font-heading font-bold transition-[transform,border-color,background-color] duration-200',
                  'hover:-translate-y-1 hover:border-primary hover:bg-primary-surface motion-reduce:hover:translate-y-0',
                  option.id === 'unsure' && 'sm:col-span-3',
                )}
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
              See my answer
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
                setPhase('animal');
                setAnimal(null);
                setClues([]);
              }}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Change my answer
            </Button>
            <Button size="lg" onClick={submit} className="flex-1">
              Submit
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
            outcome.correct && outcome.goodClues === 2 ? 'bg-grass-light' : 'bg-sunshine-light',
          )}
        >
          <p className="font-heading text-lg font-bold">{outcome.message}</p>
          <p className="mt-2 font-bold text-ink-muted">+{outcome.score} points</p>

          {outcome.reveal ? (
            <p className="mt-3 rounded-card bg-surface p-4 leading-relaxed">{picture.teaching}</p>
          ) : null}

          <Sentence text={sentence} className="mt-4" />

          <Button
            size="lg"
            onClick={outcome.canRetry ? retry : advance}
            className="mt-4 w-full"
          >
            {outcome.canRetry ? (
              <>
                <RotateCcw className="size-5" aria-hidden="true" />
                Have another look
              </>
            ) : (
              <>
                {index === pictures.length - 1 ? 'See my score' : 'Next picture'}
                <ArrowRight className="size-5" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      ) : null}
    </Card>
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
          aria-label="Hear my answer"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-105 motion-reduce:hover:scale-100"
        >
          <Volume2 className="size-6" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
