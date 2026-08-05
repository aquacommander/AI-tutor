'use client';

import { useState } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useShuffleNonce } from '@/hooks/use-shuffle';
import { seededShuffle } from '@/lib/shuffle';
import { cn } from '@/lib/utils';
import { QUIZ_PASS_MARK, type QuizQuestion } from '@/types/course';

interface LessonQuizProps {
  questions: QuizQuestion[];
  /** Called once, the first time the learner passes. */
  onPass: (score: number) => void;
  alreadyPassed: boolean;
}

/**
 * One question at a time, with the explanation shown after **every** answer.
 *
 * The curriculum is explicit that a quiz should teach rather than score, so a
 * correct answer gets its reasoning too — otherwise a child who guessed right
 * learns nothing, and has no way to know they guessed.
 *
 * Answers are never un-selectable once chosen. Letting a child change an answer
 * after seeing the explanation would turn the quiz into a clicking exercise.
 */
export function LessonQuiz({ questions, onPass, alreadyPassed }: LessonQuizProps) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const { nonce, reshuffle } = useShuffleNonce();

  const question = questions[index];
  // The data lists the correct answer first, so without this every answer would
  // be the top button. The nonce changes on every visit, so the order is new
  // each time — but stays put while a question is on screen.
  const options = question ? seededShuffle(question.options, `${question.question}:${nonce}`) : [];
  const isLast = index === questions.length - 1;
  const finished = answers.length === questions.length;
  const score = answers.filter(Boolean).length;

  if (!question) return null;

  const choose = (option: string) => {
    if (chosen) return;
    setChosen(option);
    setAnswers((prev) => [...prev, option === question.answer]);
  };

  const advance = () => {
    if (!isLast) {
      setIndex(index + 1);
      setChosen(null);
      return;
    }
    // Clearing the choice is what switches this to the results view.
    setChosen(null);
    const total = answers.filter(Boolean).length;
    if (total >= QUIZ_PASS_MARK && !alreadyPassed) onPass(total);
  };

  const restart = () => {
    setIndex(0);
    setChosen(null);
    setAnswers([]);
    reshuffle();
  };

  if (finished && chosen === null) {
    const passed = score >= QUIZ_PASS_MARK;

    return (
      <Card role="status" className={cn(passed ? 'border-grass bg-grass-light' : 'bg-sunshine-light')}>
        <h3 className="card-title font-heading">
          {passed ? 'Mission complete!' : 'Nearly there'}
        </h3>
        <p className="mt-2 text-ink-soft">
          You answered {score} out of {questions.length} correctly.
          {passed
            ? ' That earns your badge.'
            : ` You need ${QUIZ_PASS_MARK} to finish this mission — have another go, you have already read the explanations.`}
        </p>
        <Button variant={passed ? 'secondary' : 'primary'} size="md" onClick={restart} className="mt-4">
          <RotateCcw className="size-4" aria-hidden="true" />
          Try the quiz again
        </Button>
      </Card>
    );
  }

  const isCorrect = chosen === question.answer;

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <h3 className="card-title font-heading">
          Question {index + 1} of {questions.length}
        </h3>
        <p className="text-sm font-bold text-ink-muted">
          {score} correct so far
        </p>
      </div>

      <ProgressBar
        value={answers.length}
        max={questions.length}
        tone="primary"
        label="Quiz progress"
        className="mt-3"
      />

      <p className="mt-5 font-heading text-lg font-bold">{question.question}</p>

      <ul className="mt-4 space-y-2.5">
        {options.map((option) => {
          const picked = chosen === option;
          const correct = option === question.answer;
          // Only reveal the right answer once a choice has been made.
          const reveal = chosen !== null && correct;

          return (
            <li key={option}>
              <button
                type="button"
                onClick={() => choose(option)}
                disabled={chosen !== null}
                aria-label={reveal && !picked ? `${option} — this was the right answer` : option}
                className={cn(
                  'flex min-h-[52px] w-full items-center gap-3 rounded-card border-2 px-4 py-2 text-left',
                  'transition-[transform,border-color,background-color] duration-200',
                  chosen === null && 'hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary-surface',
                  'motion-reduce:hover:translate-y-0 disabled:cursor-default',
                  reveal
                    ? 'border-grass bg-grass-light'
                    : picked
                      ? 'border-coral bg-coral/10'
                      : 'border-border-soft bg-surface',
                )}
              >
                {/* Right and wrong carry an icon as well as a colour, so the
                    result survives greyscale and colour-blind viewing. */}
                <span className="flex size-6 shrink-0 items-center justify-center">
                  {reveal ? (
                    <Check className="size-5 text-grass-dark" aria-hidden="true" />
                  ) : picked ? (
                    <X className="size-5 text-coral-dark" aria-hidden="true" />
                  ) : null}
                </span>
                <span className="font-semibold">{option}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {chosen !== null ? (
        <div role="status" className="mt-5 rounded-card bg-primary-surface p-4">
          <p className="font-heading font-bold">
            {isCorrect ? 'Correct!' : `The answer is: ${question.answer}`}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{question.explanation}</p>

          <Button size="md" onClick={advance} className="mt-4">
            {isLast ? 'See my score' : 'Next question'}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
