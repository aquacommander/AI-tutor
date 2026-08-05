'use client';

import { useState } from 'react';
import { ArrowRight, Check, Lightbulb, RotateCcw, Volume2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { playSound } from '@/lib/sound';
import { useShuffleNonce } from '@/hooks/use-shuffle';
import { seededShuffle } from '@/lib/shuffle';
import { cn } from '@/lib/utils';
import type { ActivityGame, RoundVisual, Treatment } from '@/types/activity';

/**
 * The playable guided activity.
 *
 * One thing on screen, big options underneath, an answer the moment you tap.
 * Deliberately the same shape as the quiz a child has already met elsewhere in
 * the app — a six-year-old should not have to learn a new interface halfway
 * through a lesson.
 *
 * Getting it wrong is not punished: the explanation appears either way, the
 * round still counts as played, and the game always finishes. The score is
 * feedback, not a gate.
 */

/** The lesson's "tricky pictures", done with CSS rather than artwork. */
const TREATMENT: Record<Treatment, string> = {
  silhouette: 'brightness-0',
  blur: 'blur-[6px]',
  flip: 'rotate-180',
  dim: 'brightness-[0.35] contrast-75',
  // Half the picture is hidden, so shape has to carry the decision.
  peek: '[clip-path:inset(0_50%_0_0)]',
  // Drawn as an overlay by the caller, not as a filter.
  costume: '',
};

interface ActivityGameViewProps {
  game: ActivityGame;
  onFinish: () => void;
}

export function ActivityGameView({ game, onFinish }: ActivityGameViewProps) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [showClue, setShowClue] = useState(false);
  const [done, setDone] = useState(false);
  const { nonce, reshuffle } = useShuffleNonce();

  const round = game.rounds[index];
  const options = round ? seededShuffle(round.options, `${round.id}:${nonce}`) : [];
  const isLast = index === game.rounds.length - 1;

  if (!round) return null;

  const choose = (optionId: string) => {
    if (chosen) return;
    setChosen(optionId);
    if (optionId === round.answer) setCorrect((n) => n + 1);
  };

  const advance = () => {
    setChosen(null);
    setShowClue(false);
    if (isLast) {
      setDone(true);
      return;
    }
    setIndex(index + 1);
  };

  const restart = () => {
    setIndex(0);
    setChosen(null);
    setCorrect(0);
    setShowClue(false);
    setDone(false);
    reshuffle();
  };

  if (done) {
    return (
      <Card role="status" className="border-grass bg-grass-light text-center">
        <span className="block text-6xl motion-safe:animate-float" aria-hidden="true">
          🎉
        </span>
        <h3 className="mt-2 font-heading text-2xl font-bold">Activity complete!</h3>
        <p className="mt-2 font-heading text-xl font-bold text-grass-dark">
          {correct} out of {game.rounds.length} right
        </p>
        <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-ink-soft">{game.outro}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="secondary" size="md" onClick={restart}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Play again
          </Button>
          <Button size="lg" onClick={onFinish}>
            Next
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </Card>
    );
  }

  const gotItRight = chosen === round.answer;

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <p className="font-heading font-bold">
          {index + 1} of {game.rounds.length}
        </p>
        <p className="text-sm font-bold text-ink-muted">{correct} right so far</p>
      </div>
      <ProgressBar
        value={index}
        max={game.rounds.length}
        label={`${game.title} progress`}
        className="mt-2"
      />

      <div className="mt-6">
        <Visual visual={round.visual} key={round.id} />
      </div>

      <p className="mt-5 text-center font-heading text-xl font-bold sm:text-2xl">{round.question}</p>

      {/* A clue costs nothing but has to be asked for, so a child thinks first. */}
      {round.clue && !chosen ? (
        showClue ? (
          <p className="mt-4 rounded-card bg-sunshine-light px-4 py-3 text-center text-lg">
            <span aria-hidden="true">💡 </span>
            {round.clue}
          </p>
        ) : (
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm" onClick={() => setShowClue(true)}>
              <Lightbulb className="size-4" aria-hidden="true" />
              Give me a clue
            </Button>
          </div>
        )
      ) : null}

      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const picked = chosen === option.id;
          const reveal = chosen !== null && option.id === round.answer;

          return (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => choose(option.id)}
                disabled={chosen !== null}
                className={cn(
                  'flex min-h-[92px] w-full flex-col items-center justify-center gap-1 rounded-card border-2 px-3 py-4',
                  'transition-[transform,border-color,background-color] duration-200',
                  chosen === null &&
                    'hover:-translate-y-1 hover:border-primary hover:bg-primary-surface motion-reduce:hover:translate-y-0',
                  'disabled:cursor-default',
                  reveal
                    ? 'border-grass bg-grass-light'
                    : picked
                      ? 'border-coral bg-coral/10'
                      : 'border-border-soft bg-surface',
                )}
              >
                {option.emoji ? (
                  <span className="text-3xl" aria-hidden="true">
                    {option.emoji}
                  </span>
                ) : null}
                <span className="font-heading font-bold">{option.label}</span>
                {/* Right and wrong carry an icon too, not colour alone. */}
                {reveal ? (
                  <Check className="size-5 text-grass-dark" aria-hidden="true" />
                ) : picked ? (
                  <X className="size-5 text-coral-dark" aria-hidden="true" />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {chosen !== null ? (
        <div
          role="status"
          className={cn(
            'mt-5 rounded-card p-5',
            gotItRight ? 'bg-grass-light' : 'bg-sunshine-light',
          )}
        >
          <p className="font-heading text-lg font-bold">
            {gotItRight ? 'Yes! Nice detective work.' : 'Good try — here is what happened.'}
          </p>
          <p className="mt-2 text-lg leading-relaxed">{round.explanation}</p>
          <Button size="lg" onClick={advance} className="mt-4 w-full">
            {isLast ? 'Finish the activity' : 'Next'}
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

function Visual({ visual }: { visual: RoundVisual }) {
  if (visual.kind === 'sound') {
    return (
      <div className="rounded-card bg-primary-surface p-6 text-center">
        <span className="block text-6xl motion-safe:animate-float" aria-hidden="true">
          🔊
        </span>
        <Button size="lg" onClick={() => playSound(visual.sound)} className="mt-4">
          <Volume2 className="size-5" aria-hidden="true" />
          Play the sound
        </Button>
        {/* Anyone who cannot hear it still gets a fair description. */}
        <p className="mt-3 text-sm text-ink-soft">{visual.label}</p>
      </div>
    );
  }

  if (visual.kind === 'pair') {
    return (
      <div className="flex items-center justify-center gap-4 rounded-card bg-primary-surface p-6">
        <span className="text-6xl sm:text-7xl" aria-hidden="true">
          {visual.left}
        </span>
        <span className="font-heading text-3xl font-bold text-ink-muted" aria-hidden="true">
          +
        </span>
        <span className="text-6xl sm:text-7xl" aria-hidden="true">
          {visual.right}
        </span>
        <span className="sr-only">{visual.label}</span>
      </div>
    );
  }

  if (visual.kind === 'quote') {
    return (
      <div className="rounded-card bg-primary-surface p-6 text-center">
        <p className="whitespace-pre-line font-heading text-xl italic leading-relaxed">
          &ldquo;{visual.text}&rdquo;
        </p>
        <span className="sr-only">{visual.label}</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-[180px] items-center justify-center overflow-hidden rounded-card bg-primary-surface p-6">
      <span
        aria-hidden="true"
        className={cn(
          'text-[6rem] leading-none transition-transform duration-500 sm:text-[8rem]',
          visual.treatment ? TREATMENT[visual.treatment] : 'motion-safe:animate-float',
        )}
      >
        {visual.emoji}
      </span>
      {/* The label never gives the answer away — it describes what is visible. */}
      <span className="sr-only">{visual.label}</span>
    </div>
  );
}
