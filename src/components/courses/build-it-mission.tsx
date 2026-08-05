'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import {
  POINTS,
  missionMaxScore,
  type BuildMission,
  type MissionOption,
} from '@/data/missions/build-it';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { useShuffleNonce } from '@/hooks/use-shuffle';
import { seededShuffle } from '@/lib/shuffle';
import { canSpeak, speak, stopSpeaking } from '@/lib/speech';
import { cn } from '@/lib/utils';
import type { ActivityResult } from '@/types/learner';

/**
 * The independent mission, as something a child builds rather than reads.
 *
 * The course plan writes these as short written tasks — explain a glitch, write
 * a model card, design a permission rule. Here a child assembles the same thing
 * from cards and the platform writes the sentence, because the objective is the
 * reasoning and typing would measure spelling instead.
 *
 * Every mission ends with a **check** question. Building something is not proof
 * of understanding it: a child can pick sensible-looking cards and still hold
 * the misconception the lesson exists to correct. The check is where that shows.
 */

type Phase = 'build' | 'sentence' | 'check' | 'done';

export function BuildItMission({
  mission,
  lessonKey,
  onFinish,
}: {
  mission: BuildMission;
  lessonKey: string;
  onFinish: () => void;
}) {
  const { recordActivity } = useLearnerProgress();
  const { nonce, reshuffle } = useShuffleNonce();

  const [stepIndex, setStepIndex] = useState(0);
  const [picks, setPicks] = useState<Record<string, string[]>>({});
  const [phase, setPhase] = useState<Phase>('build');
  const [checkChoice, setCheckChoice] = useState<string | null>(null);

  useEffect(() => () => stopSpeaking(), []);

  const step = mission.steps[stepIndex];
  const maxScore = missionMaxScore(mission);

  const optionsFor = (options: MissionOption[], id: string) =>
    seededShuffle(options, `${mission.lessonKey}:${id}:${nonce}`);

  const chosenLabels = mission.steps.map((entry) =>
    (picks[entry.id] ?? [])
      .map((id) => entry.options.find((option) => option.id === id)?.label ?? '')
      .join(', '),
  );

  const sentence = mission.sentence.replace(/\{(\d+)\}/g, (_, n: string) => {
    const label = chosenLabels[Number(n)] ?? '';
    // Lower-case the first letter so a card reads naturally mid-sentence,
    // unless it starts with a quote or a capitalised word like IF.
    return /^["“A-Z]{2}|^["“]/.test(label) ? label : label.charAt(0).toLowerCase() + label.slice(1);
  });

  const choiceScore = mission.steps.reduce((total, entry) => {
    const picked = picks[entry.id] ?? [];
    const good = picked.filter(
      (id) => entry.options.find((option) => option.id === id)?.good,
    ).length;
    return total + good * POINTS.choice;
  }, 0);

  const checkCorrect = checkChoice === mission.check.answer;
  const score = choiceScore + (checkCorrect ? POINTS.check : 0);

  const toggle = (optionId: string) => {
    if (!step) return;
    setPicks((current) => {
      const picked = current[step.id] ?? [];
      if (picked.includes(optionId)) {
        return { ...current, [step.id]: picked.filter((id) => id !== optionId) };
      }
      if (step.pick === 1) return { ...current, [step.id]: [optionId] };
      // Past the limit, the newest choice replaces the oldest.
      const next = picked.length < step.pick ? [...picked, optionId] : [...picked.slice(1), optionId];
      return { ...current, [step.id]: next };
    });
  };

  const advance = () => {
    if (stepIndex < mission.steps.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }
    setPhase('sentence');
  };

  const restart = () => {
    setPicks({});
    setStepIndex(0);
    setCheckChoice(null);
    setPhase('build');
    reshuffle();
  };

  const finish = () => {
    const result: ActivityResult = {
      key: `${lessonKey}#mission`,
      score,
      maxScore,
      correctCategories: checkCorrect ? 1 : 0,
      strongClues: choiceScore / POINTS.choice,
      completed: true,
      rounds: mission.steps.map((entry) => ({
        roundId: entry.id,
        category: (picks[entry.id] ?? []).join('+'),
        clues: picks[entry.id] ?? [],
        attempts: 1,
        score: 0,
      })),
      updatedAt: new Date().toISOString(),
    };
    recordActivity(result);
    setPhase('done');
  };

  if (phase === 'done') {
    const passed = score >= maxScore * 0.7;

    return (
      <Card
        role="status"
        className={cn('text-center', passed ? 'border-grass bg-grass-light' : 'bg-sunshine-light')}
      >
        <span className="block text-6xl motion-safe:animate-float" aria-hidden="true">
          {passed ? '🎉' : '💪'}
        </span>
        <h3 className="mt-2 font-heading text-2xl font-bold">Mission complete!</h3>
        <p className="mt-2 font-heading text-xl font-bold text-grass-dark">
          {score} out of {maxScore} points
        </p>

        <p className="mx-auto mt-4 max-w-lg rounded-card bg-surface p-4 text-left font-heading text-lg font-bold leading-relaxed">
          {sentence}
        </p>
        <p className="mx-auto mt-3 max-w-lg leading-relaxed text-ink-soft">{mission.outro}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="secondary" size="md" onClick={restart}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Build it again
          </Button>
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
        <p className="font-heading font-bold">{mission.title}</p>
        <p className="text-sm font-bold text-ink-muted">
          {phase === 'build' ? `Step ${stepIndex + 1} of ${mission.steps.length}` : 'Almost there'}
        </p>
      </div>
      <ProgressBar
        value={phase === 'build' ? stepIndex : mission.steps.length}
        max={mission.steps.length}
        label={`${mission.title} progress`}
        className="mt-2"
      />

      {phase === 'build' && step ? (
        <>
          <Prompt text={step.question} />
          {step.pick > 1 ? (
            <p className="mt-1 text-center text-sm font-bold text-ink-muted" aria-live="polite">
              {(picks[step.id] ?? []).length} of {step.pick} chosen
            </p>
          ) : null}

          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {optionsFor(step.options, step.id).map((option) => {
              const picked = (picks[step.id] ?? []).includes(option.id);
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => toggle(option.id)}
                    aria-pressed={picked}
                    className={cn(
                      'flex min-h-[72px] w-full items-center gap-3 rounded-card border-2 px-4 py-3 text-left text-base font-semibold',
                      'transition-[transform,border-color,background-color] duration-200',
                      'hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
                      picked
                        ? 'border-primary bg-primary text-white shadow-button'
                        : 'border-border-soft bg-surface text-ink hover:border-primary/50 hover:bg-primary-surface',
                    )}
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {option.emoji}
                    </span>
                    <span className="flex-1">{option.label}</span>
                    {picked ? <Check className="size-5 shrink-0" aria-hidden="true" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>

          {(picks[step.id] ?? []).length === step.pick ? (
            <Button size="lg" onClick={advance} className="mt-5 w-full">
              {stepIndex === mission.steps.length - 1 ? 'See what I built' : 'Next'}
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          ) : null}
        </>
      ) : null}

      {phase === 'sentence' ? (
        <>
          <Prompt text="Here is what you built" />
          <div className="mt-5 flex items-center gap-3 rounded-card bg-primary-surface p-5">
            <p className="flex-1 font-heading text-lg font-bold leading-relaxed sm:text-xl">
              {sentence}
            </p>
            {canSpeak() ? (
              <button
                type="button"
                onClick={() => speak(sentence)}
                aria-label="Hear what I built"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-105 motion-reduce:hover:scale-100"
              >
                <Volume2 className="size-6" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" size="md" onClick={restart}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Change my answer
            </Button>
            <Button size="lg" onClick={() => setPhase('check')} className="flex-1">
              One last question
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          </div>
        </>
      ) : null}

      {phase === 'check' ? (
        <>
          <Prompt text={mission.check.question} />
          <ul className="mt-5 space-y-3">
            {seededShuffle(mission.check.options, `check:${mission.lessonKey}:${nonce}`).map(
              (option) => {
                const picked = checkChoice === option.id;
                const reveal = checkChoice !== null && option.id === mission.check.answer;

                return (
                  <li key={option.id}>
                    <button
                      type="button"
                      onClick={() => !checkChoice && setCheckChoice(option.id)}
                      disabled={checkChoice !== null}
                      className={cn(
                        'flex min-h-[64px] w-full items-center gap-3 rounded-card border-2 px-4 py-3 text-left text-base font-semibold',
                        'transition-[transform,border-color,background-color] duration-200',
                        checkChoice === null &&
                          'hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary-surface',
                        'motion-reduce:hover:translate-y-0 disabled:cursor-default',
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
                      <span className="flex-1">{option.label}</span>
                      {reveal ? (
                        <Check className="size-5 shrink-0 text-grass-dark" aria-hidden="true" />
                      ) : null}
                    </button>
                  </li>
                );
              },
            )}
          </ul>

          {checkChoice !== null ? (
            <div
              role="status"
              className={cn('mt-5 rounded-card p-5', checkCorrect ? 'bg-grass-light' : 'bg-sunshine-light')}
            >
              <p className="font-heading text-lg font-bold">
                {checkCorrect ? 'Exactly right.' : 'Good try — here is the thinking.'}
              </p>
              <p className="mt-2 text-lg leading-relaxed">{mission.check.explanation}</p>
              <Button size="lg" onClick={finish} className="mt-4 w-full">
                See my score
                <ArrowRight className="size-5" aria-hidden="true" />
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
    </Card>
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
