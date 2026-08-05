'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, EyeOff, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import {
  PITCH_OPTIONS,
  RHYTHM_OPTIONS,
  RIDDLE_ROUNDS,
  RIDDLE_SCORING,
  SOUND_DETECTIVE_BADGE,
  VOLUME_OPTIONS,
  type PitchId,
  type RhythmId,
  type RiddleRound,
  type VolumeId,
} from '@/data/activities/sound-riddle';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { useShuffleNonce } from '@/hooks/use-shuffle';
import { getVolume, playSound, setVolume, stopSound } from '@/lib/sound';
import { canSpeak, speak, stopSpeaking } from '@/lib/speech';
import { seededShuffle } from '@/lib/shuffle';
import { cn } from '@/lib/utils';
import type { ActivityResult } from '@/types/learner';

/**
 * Sound Riddle Challenge.
 *
 * A child describes the sound three ways — pitch, rhythm, volume — before
 * guessing what made it. That order matters: guessing first and justifying
 * afterwards is how you talk yourself into an answer.
 *
 * Two accessibility requirements shaped this more than anything else. Replaying
 * is unlimited in effect and never costs points, because a hearing-impaired
 * child should not be marked down for needing to listen again. And **Show me
 * the sound in words** describes every sound in text without naming it, so the
 * whole activity is solvable with no audio at all.
 */

type Step = 'pitch' | 'rhythm' | 'volume' | 'source' | 'feedback';

interface RoundRecord {
  roundId: string;
  category: string;
  clues: string[];
  attempts: number;
  score: number;
}

interface Outcome {
  sourceCorrect: boolean;
  pitchOk: boolean;
  rhythmOk: boolean;
  volumeOk: boolean;
  stars: number;
  score: number;
  message: string;
  weakest: 'pitch' | 'rhythm' | 'volume' | null;
  reveal: boolean;
  canRetry: boolean;
}

function judge(
  round: RiddleRound,
  pitch: PitchId,
  rhythm: RhythmId,
  volume: VolumeId,
  source: string,
  attempt: number,
): Outcome {
  const pitchOk = round.pitch.includes(pitch);
  const rhythmOk = round.rhythm.includes(rhythm);
  const volumeOk = round.volume.includes(volume);
  const sourceCorrect = source === round.answer;
  const good = [pitchOk, rhythmOk, volumeOk].filter(Boolean).length;

  const score =
    (sourceCorrect ? RIDDLE_SCORING.source : 0) + good * RIDDLE_SCORING.clue;

  const weakest = !pitchOk ? 'pitch' : !rhythmOk ? 'rhythm' : !volumeOk ? 'volume' : null;

  if (sourceCorrect && good === 3) {
    return {
      sourceCorrect,
      pitchOk,
      rhythmOk,
      volumeOk,
      stars: 4,
      score,
      message: 'Excellent listening! You used pitch, rhythm, and volume to solve the sound mystery.',
      weakest: null,
      reveal: true,
      canRetry: false,
    };
  }

  if (sourceCorrect) {
    return {
      sourceCorrect,
      pitchOk,
      rhythmOk,
      volumeOk,
      stars: 3,
      score,
      message: `You found the sound! Listen once more and check the ${weakest} clue.`,
      weakest,
      reveal: true,
      canRetry: false,
    };
  }

  if (attempt >= 2) {
    return {
      sourceCorrect,
      pitchOk,
      rhythmOk,
      volumeOk,
      stars: good > 0 ? 1 : 0,
      score,
      message: `The sound came from a ${round.answer}. It was mostly ${round.reveal.pitch}, had a ${round.reveal.rhythm} rhythm, and was ${round.reveal.volume}.`,
      weakest,
      reveal: true,
      canRetry: false,
    };
  }

  return {
    sourceCorrect,
    pitchOk,
    rhythmOk,
    volumeOk,
    stars: 0,
    score,
    message: 'Your sound clues are helpful. Listen again and compare your clues with the answer pictures.',
    weakest,
    reveal: false,
    canRetry: true,
  };
}

export function SoundRiddle({ lessonKey, onFinish }: { lessonKey: string; onFinish: () => void }) {
  const { recordActivity, earnBadge } = useLearnerProgress();

  const [index, setIndex] = useState(0);
  const [step, setStep] = useState<Step>('pitch');
  const [pitch, setPitch] = useState<PitchId | null>(null);
  const [rhythm, setRhythm] = useState<RhythmId | null>(null);
  const [volume, setVolumeChoice] = useState<VolumeId | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [replays, setReplays] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [records, setRecords] = useState<RoundRecord[]>([]);
  const [done, setDone] = useState(false);
  const [visualMode, setVisualMode] = useState(false);
  const [level, setLevel] = useState(getVolume());
  const { nonce } = useShuffleNonce();

  useEffect(() => () => stopSpeaking(), []);

  const round = RIDDLE_ROUNDS[index];
  if (!round) return null;

  // Every source list is authored with the true answer first. Shuffled per
  // round and per visit; "Need More Information" stays last, because it is an
  // escape hatch rather than a fifth guess and a child needs to find it.
  const sources = [
    ...seededShuffle(
      round.sources.filter((card) => card.id !== 'unsure'),
      `${round.id}:${nonce}`,
    ),
    ...round.sources.filter((card) => card.id === 'unsure'),
  ];

  const riddle =
    pitch && rhythm && volume
      ? `My sound is ${pitch}, has a ${rhythm} rhythm, and is ${volume}. What made it?`
      : '';

  const play = () => {
    playSound(round.sound);
    setReplays((n) => n + 1);
  };

  const submit = () => {
    if (!pitch || !rhythm || !volume || !source) return;
    const result = judge(round, pitch, rhythm, volume, source, attempt);
    setOutcome(result);
    setStep('feedback');
    speak(result.message);
    if (result.reveal && !result.sourceCorrect) playSound(round.sound);
  };

  /** A retry keeps the clue choices — only the guess is reconsidered. */
  const retry = () => {
    setAttempt(2);
    setOutcome(null);
    setSource(null);
    setStep('source');
  };

  const advance = () => {
    if (!outcome || !pitch || !rhythm || !volume || !source) return;

    const all = [
      ...records,
      {
        roundId: round.id,
        category: source,
        clues: [pitch, rhythm, volume],
        attempts: attempt,
        score: outcome.score,
      },
    ];
    setRecords(all);

    if (index === RIDDLE_ROUNDS.length - 1) {
      const score = all.reduce((total, entry) => total + entry.score, 0);
      const result: ActivityResult = {
        key: `${lessonKey}#mission`,
        score,
        maxScore: RIDDLE_SCORING.total,
        correctCategories: all.filter((entry, i) => entry.category === RIDDLE_ROUNDS[i]?.answer)
          .length,
        strongClues: all.reduce((total, entry, i) => {
          const r = RIDDLE_ROUNDS[i];
          if (!r) return total;
          const [p, rh, v] = entry.clues;
          return (
            total +
            (r.pitch.includes(p as PitchId) ? 1 : 0) +
            (r.rhythm.includes(rh as RhythmId) ? 1 : 0) +
            (r.volume.includes(v as VolumeId) ? 1 : 0)
          );
        }, 0),
        completed: true,
        rounds: all,
        updatedAt: new Date().toISOString(),
      };
      recordActivity(result);
      if (score >= RIDDLE_SCORING.passMark) earnBadge(SOUND_DETECTIVE_BADGE);
      setDone(true);
      return;
    }

    setIndex(index + 1);
    setStep('pitch');
    setPitch(null);
    setRhythm(null);
    setVolumeChoice(null);
    setSource(null);
    setReplays(0);
    setAttempt(1);
    setOutcome(null);
  };

  if (done) return <Completion records={records} onFinish={onFinish} />;

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <p className="font-heading font-bold">
          Round {index + 1} of {RIDDLE_ROUNDS.length}
        </p>
        {attempt > 1 ? <p className="text-sm font-bold text-sunshine-dark">Second try</p> : null}
      </div>
      <ProgressBar
        value={index}
        max={RIDDLE_ROUNDS.length}
        label="Sound Riddle progress"
        className="mt-2"
      />

      <Prompt text="Listen carefully. What clues can you hear?" />

      {/* The player */}
      <div className="mt-5 rounded-card bg-primary-surface p-6 text-center">
        <SoundWave playing={replays > 0} />

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={play}>
            <Volume2 className="size-6" aria-hidden="true" />
            {replays === 0 ? 'Play Sound' : 'Play it again'}
          </Button>
          {replays > 0 ? (
            <Button variant="secondary" size="lg" onClick={stopSound}>
              <Pause className="size-5" aria-hidden="true" />
              Stop
            </Button>
          ) : null}
        </div>

        <p className="mt-2 text-sm text-ink-soft" aria-live="polite">
          {replays === 0
            ? 'Press play when you are ready.'
            : `Played ${replays} time${replays === 1 ? '' : 's'} — listen as often as you like.`}
        </p>

        <div className="mx-auto mt-4 flex max-w-xs items-center gap-3">
          <VolumeX className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(level * 100)}
            onChange={(event) => {
              const next = Number(event.target.value) / 100;
              setVolume(next);
              setLevel(next);
            }}
            aria-label="Sound volume"
            className="h-2 flex-1 cursor-pointer appearance-none rounded-button bg-primary-light accent-primary"
          />
          <Volume2 className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
        </div>

        {/* Solvable without hearing anything at all. */}
        <div className="mt-4">
          <Button variant="ghost" size="sm" onClick={() => setVisualMode((on) => !on)}>
            <EyeOff className="size-4" aria-hidden="true" />
            {visualMode ? 'Hide the written clue' : 'Show me the sound in words'}
          </Button>
        </div>
        {visualMode ? (
          <p className="mt-3 rounded-card bg-surface p-4 text-left leading-relaxed">
            {round.visualClue}
          </p>
        ) : null}
      </div>

      <ClueStep
        show={step === 'pitch' || Boolean(pitch)}
        active={step === 'pitch'}
        question="Is the sound mostly high or low?"
        options={PITCH_OPTIONS}
        value={pitch}
        highlight={outcome?.weakest === 'pitch'}
        onPick={(id) => {
          setPitch(id as PitchId);
          if (step === 'pitch') setStep('rhythm');
        }}
      />

      <ClueStep
        show={step === 'rhythm' || Boolean(rhythm)}
        active={step === 'rhythm'}
        question="What does the rhythm sound like?"
        options={RHYTHM_OPTIONS}
        value={rhythm}
        highlight={outcome?.weakest === 'rhythm'}
        onPick={(id) => {
          setRhythm(id as RhythmId);
          if (step === 'rhythm') setStep('volume');
        }}
      />

      <ClueStep
        show={step === 'volume' || Boolean(volume)}
        active={step === 'volume'}
        question="How loud is the sound?"
        options={VOLUME_OPTIONS}
        value={volume}
        highlight={outcome?.weakest === 'volume'}
        onPick={(id) => {
          setVolumeChoice(id as VolumeId);
          if (step === 'volume') setStep('source');
        }}
      />

      {riddle ? (
        <div className="mt-6 flex items-center gap-3 rounded-card bg-sunshine-light p-4">
          <p className="flex-1 font-heading text-lg font-bold leading-relaxed">{riddle}</p>
          {canSpeak() ? (
            <button
              type="button"
              onClick={() => speak(riddle)}
              aria-label="Hear my riddle"
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-105 motion-reduce:hover:scale-100"
            >
              <Volume2 className="size-6" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : null}

      {step === 'source' ? (
        <>
          <Prompt text="What do you think made this sound?" />
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {sources.map((card) => (
              <li key={card.id} className={cn(card.id === 'unsure' && 'sm:col-span-2')}>
                <button
                  type="button"
                  onClick={() => setSource(card.id)}
                  aria-pressed={source === card.id}
                  className={cn(
                    'flex min-h-[80px] w-full items-center justify-center gap-3 rounded-card border-2 px-4 font-heading text-lg font-bold',
                    'transition-[transform,border-color,background-color] duration-200',
                    'hover:-translate-y-1 motion-reduce:hover:translate-y-0',
                    source === card.id
                      ? 'border-primary bg-primary text-white shadow-button'
                      : 'border-border-soft bg-surface hover:border-primary hover:bg-primary-surface',
                  )}
                >
                  <span className="text-3xl" aria-hidden="true">
                    {card.emoji}
                  </span>
                  {card.label}
                </button>
              </li>
            ))}
          </ul>

          {source ? (
            <Button size="lg" onClick={submit} className="mt-5 w-full">
              Submit
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          ) : null}
        </>
      ) : null}

      {step === 'feedback' && outcome ? (
        <div
          role="status"
          className={cn(
            'mt-6 rounded-card p-5',
            outcome.stars === 4 ? 'bg-grass-light' : 'bg-sunshine-light',
          )}
        >
          <Stars count={outcome.stars} />
          <p className="mt-3 text-lg leading-relaxed">{outcome.message}</p>
          <p className="mt-2 font-bold text-ink-muted">+{outcome.score} points</p>

          {outcome.reveal ? (
            <p className="mt-3 rounded-card bg-surface p-4 leading-relaxed">{round.teaching}</p>
          ) : null}

          <Button
            size="lg"
            onClick={outcome.canRetry ? retry : advance}
            className="mt-4 w-full"
          >
            {outcome.canRetry ? (
              <>
                <RotateCcw className="size-5" aria-hidden="true" />
                Listen again and try once more
              </>
            ) : (
              <>
                {index === RIDDLE_ROUNDS.length - 1 ? 'See my score' : 'Next sound'}
                <ArrowRight className="size-5" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
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

function ClueStep({
  show,
  active,
  question,
  options,
  value,
  highlight,
  onPick,
}: {
  show: boolean;
  active: boolean;
  question: string;
  options: Array<{ id: string; label: string; emoji: string }>;
  value: string | null;
  highlight?: boolean;
  onPick: (id: string) => void;
}) {
  if (!show) return null;

  return (
    <div className={cn('mt-6', highlight && 'rounded-card bg-sunshine-light p-4 ring-2 ring-sunshine')}>
      {active ? <Prompt text={question} /> : <p className="font-heading font-bold">{question}</p>}

      <ul className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const picked = value === option.id;
          return (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => onPick(option.id)}
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
                  {option.emoji}
                </span>
                {option.label}
                {picked ? <Check className="size-4" aria-hidden="true" /> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** A visual stand-in for the sound, for anyone who cannot hear it. */
function SoundWave({ playing }: { playing: boolean }) {
  return (
    <p className="flex h-16 items-end justify-center gap-1.5" aria-hidden="true">
      {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.45].map((height, i) => (
        <span
          key={i}
          style={{ height: `${height * 100}%`, animationDelay: `${i * 90}ms` }}
          className={cn(
            'w-3 rounded-button bg-primary/70',
            playing && 'motion-safe:animate-thinking',
          )}
        />
      ))}
    </p>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <p className="flex justify-center gap-1">
      <span className="sr-only">{count} out of 4 stars</span>
      {[1, 2, 3, 4].map((star) => (
        <span
          key={star}
          aria-hidden="true"
          className={cn('text-3xl', star <= count ? '' : 'opacity-25 grayscale')}
        >
          ⭐
        </span>
      ))}
    </p>
  );
}

function Completion({ records, onFinish }: { records: RoundRecord[]; onFinish: () => void }) {
  const score = records.reduce((total, entry) => total + entry.score, 0);
  const correct = records.filter((entry, i) => entry.category === RIDDLE_ROUNDS[i]?.answer).length;
  const passed = score >= RIDDLE_SCORING.passMark;

  // Which of the three listening skills held up best, and which did not.
  const tally = { pitch: 0, rhythm: 0, volume: 0 };
  records.forEach((entry, i) => {
    const round = RIDDLE_ROUNDS[i];
    if (!round) return;
    const [p, rh, v] = entry.clues;
    if (round.pitch.includes(p as PitchId)) tally.pitch += 1;
    if (round.rhythm.includes(rh as RhythmId)) tally.rhythm += 1;
    if (round.volume.includes(v as VolumeId)) tally.volume += 1;
  });

  const skills: Array<keyof typeof tally> = ['pitch', 'rhythm', 'volume'];
  const ranked = [...skills].sort((a, b) => tally[b] - tally[a]);
  const strongest = ranked[0] ?? 'pitch';
  const weakest = ranked[2] ?? 'volume';

  return (
    <Card
      role="status"
      className={cn('text-center', passed ? 'border-grass bg-grass-light' : 'bg-sunshine-light')}
    >
      <span className="block text-6xl motion-safe:animate-float" aria-hidden="true">
        {passed ? '🎧' : '💪'}
      </span>
      <h3 className="mt-2 font-heading text-2xl font-bold">
        You completed Sound Riddle Challenge!
      </h3>
      <p className="mx-auto mt-2 max-w-lg text-lg leading-relaxed text-ink-soft">
        You used pitch, rhythm, and volume to investigate mystery sounds.
      </p>

      <dl className="mx-auto mt-5 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Score', value: `${score}` },
          { label: 'Sounds found', value: `${correct} / ${RIDDLE_ROUNDS.length}` },
          { label: 'Best skill', value: strongest },
          { label: 'Practise', value: weakest },
        ].map((stat) => (
          <div key={stat.label} className="rounded-card bg-surface p-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-muted">
              {stat.label}
            </dt>
            <dd className="mt-1 font-heading text-lg font-bold capitalize">{stat.value}</dd>
          </div>
        ))}
      </dl>

      {passed ? (
        <p className="mt-5 inline-flex items-center gap-3 rounded-card border-2 border-grass bg-surface px-5 py-3">
          <span className="text-3xl motion-safe:animate-twinkle" aria-hidden="true">
            🎧
          </span>
          <span className="text-left">
            <span className="block font-heading font-bold">Sound Detective</span>
            <span className="block text-xs text-ink-muted">Badge earned</span>
          </span>
        </p>
      ) : (
        <p className="mt-4 text-ink-soft">
          Score {RIDDLE_SCORING.passMark} to earn the Sound Detective badge — listening again is
          always free.
        </p>
      )}

      <div className="mt-6">
        <Button size="lg" onClick={onFinish}>
          On to the quiz
          <ArrowRight className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </Card>
  );
}
