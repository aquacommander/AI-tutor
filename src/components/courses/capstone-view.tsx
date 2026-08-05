'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Lock, Target } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { findBadge } from '@/data/badges';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { ROUTES } from '@/lib/constants';
import { img } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { Course } from '@/types/course';

/**
 * The end-of-course project.
 *
 * The plan gives these a specific job: they carry the learning that the six
 * unmade videos would have held, and they are what the course badge is actually
 * for — "Award the course badge only after the capstone, not after passive video
 * viewing." So the badge is locked until every lesson is done and each task has
 * been ticked off.
 *
 * There is no marking here. The success standard is that the child can explain
 * their reasoning, which is a conversation with an adult, not something a
 * webpage can score. The platform's job is to set the tasks and record that they
 * were done.
 */
export function CapstoneView({ course }: { course: Course }) {
  const { learner, isLoaded, completeCapstone } = useLearnerProgress();
  const [ticked, setTicked] = useState<number[]>([]);
  const [justEarned, setJustEarned] = useState(false);

  const completed = learner?.completedLessons ?? [];
  const lessonsLeft = course.lessons.filter(
    (lesson) => !completed.includes(`${course.id}/${lesson.id}`),
  );
  const alreadyDone = completed.includes(`capstone:${course.id}`);
  const allTicked = ticked.length === course.capstone.tasks.length;
  const badge = findBadge(course.capstone.badgeId);

  const toggle = (i: number) =>
    setTicked((current) =>
      current.includes(i) ? current.filter((n) => n !== i) : [...current, i],
    );

  const finish = () => {
    if (completeCapstone(course.id)) setJustEarned(true);
  };

  return (
    <Container className="max-w-3xl space-y-6 pb-8">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link
          href={`${ROUTES.courses}/${course.id}`}
          className="inline-flex min-h-[44px] items-center gap-1.5 font-bold text-primary hover:text-primary-dark"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {course.title}
        </Link>
      </nav>

      <Card className="text-center">
        <span className="block text-6xl motion-safe:animate-float sm:text-7xl" aria-hidden="true">
          {badge?.emoji ?? '🏅'}
        </span>
        <p className="mt-3 text-sm font-bold uppercase tracking-wide text-primary">
          Final project · {course.capstone.time}
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">
          {course.capstone.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">{course.capstone.summary}</p>
      </Card>

      {/* Locked until the lessons are done — the badge has to mean something. */}
      {lessonsLeft.length > 0 && !alreadyDone ? (
        <Card className="border-sunshine bg-sunshine-light">
          <p className="flex items-center gap-2 font-heading text-lg font-bold">
            <Lock className="size-5" aria-hidden="true" />
            Finish the missions first
          </p>
          <p className="mt-2 text-ink-soft">
            {lessonsLeft.length} mission{lessonsLeft.length === 1 ? '' : 's'} still to go. The final
            project brings all of them together.
          </p>
          <ul className="mt-3 space-y-2">
            {lessonsLeft.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  href={`${ROUTES.courses}/${course.id}/${lesson.id}`}
                  className="inline-flex min-h-[44px] items-center gap-2 font-bold text-primary hover:text-primary-dark"
                >
                  <Target className="size-4" aria-hidden="true" />
                  {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <>
          <Card>
            <h2 className="card-title font-heading">Your four tasks</h2>
            <p className="mt-1.5 text-sm text-ink-soft">
              Tick each one off as you finish it. You will need paper or something to draw on.
            </p>

            <ul className="mt-5 space-y-3">
              {course.capstone.tasks.map((task, i) => {
                const done = ticked.includes(i);

                return (
                  <li key={task}>
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-pressed={done}
                      className={cn(
                        'flex w-full items-start gap-3 rounded-card border-2 p-4 text-left text-lg',
                        'transition-[transform,border-color,background-color] duration-200',
                        'hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
                        done
                          ? 'border-grass bg-grass-light'
                          : 'border-border-soft bg-surface hover:border-primary/50',
                      )}
                    >
                      <span
                        className={cn(
                          'flex size-8 shrink-0 items-center justify-center rounded-full font-heading font-bold',
                          done ? 'bg-grass text-white' : 'bg-primary-surface text-primary-dark',
                        )}
                      >
                        {done ? <Check className="size-5" aria-hidden="true" /> : i + 1}
                      </span>
                      <span className={cn(done && 'text-ink-soft line-through')}>{task}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card className="bg-primary-surface">
            <h2 className="font-heading text-lg font-bold">What makes it finished</h2>
            <p className="mt-2 text-lg leading-relaxed">{course.capstone.successStandard}</p>
            <p className="mt-3 text-sm text-ink-soft">
              <span className="font-bold">You will produce:</span> {course.capstone.evidence}
            </p>
          </Card>

          {alreadyDone || justEarned ? (
            <Card role="status" className="border-grass bg-grass-light text-center">
              <Image
                {...img('rewards/trophy.webp')}
                alt=""
                aria-hidden="true"
                sizes="160px"
                className="mx-auto size-28 object-contain motion-safe:animate-float"
              />
              <h2 className="mt-2 font-heading text-2xl font-bold">
                {course.title} complete!
              </h2>
              {badge ? (
                <p className="mt-3 inline-flex items-center gap-2 rounded-card border-2 border-grass bg-surface px-4 py-3">
                  <span className="text-3xl motion-safe:animate-twinkle" aria-hidden="true">
                    {badge.emoji}
                  </span>
                  <span className="text-left">
                    <span className="block font-heading font-bold">{badge.name}</span>
                    <span className="block text-xs text-ink-muted">Course badge earned</span>
                  </span>
                </p>
              ) : null}
              <div className="mt-5">
                <ButtonLink href={ROUTES.courses} size="lg">
                  Back to the courses
                  <ArrowRight className="size-5" aria-hidden="true" />
                </ButtonLink>
              </div>
            </Card>
          ) : (
            <Button size="lg" onClick={finish} disabled={!allTicked} className="w-full">
              {allTicked
                ? `Finish and earn the ${badge?.name ?? 'course badge'}`
                : `Tick all ${course.capstone.tasks.length} tasks to finish`}
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          )}
        </>
      )}

      {!isLoaded ? null : (
        <details className="rounded-card border border-border-soft bg-surface p-4 shadow-card">
          <summary className="cursor-pointer font-heading font-bold">For grown-ups and tutors</summary>
          <p className="mt-3 text-sm text-ink-soft">
            This project is assessed by conversation, not by the website. Ask your child to talk
            through <em>why</em> they reached each result — {course.capstone.successStandard.toLowerCase()}
          </p>
        </details>
      )}
    </Container>
  );
}
