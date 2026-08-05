'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Clock, Lock, Target } from 'lucide-react';
import { Badge, DifficultyBadge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { ProgressBar } from '@/components/ui/progress-bar';
import { courseTotalXp, courseVideoSeconds } from '@/data/courses';
import { findBadge } from '@/data/badges';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { ROUTES } from '@/lib/constants';
import { img } from '@/lib/images';
import { courseTime, formatDuration } from '@/lib/lesson-time';
import { cn } from '@/lib/utils';
import type { Course } from '@/types/course';

export function CourseDetail({ course }: { course: Course }) {
  const { learner } = useLearnerProgress();
  const completed = learner?.completedLessons ?? [];

  const isDone = (lessonId: string) => completed.includes(`${course.id}/${lessonId}`);
  const doneCount = course.lessons.filter((lesson) => isDone(lesson.id)).length;
  const capstoneDone = completed.includes(`capstone:${course.id}`);

  // Everything counts toward the bar, capstone included — it is a real stage.
  const totalSteps = course.lessons.length + 1;
  const doneSteps = doneCount + (capstoneDone ? 1 : 0);

  const nextLesson = course.lessons.find((lesson) => !isDone(lesson.id));
  const capstoneBadge = findBadge(course.capstone.badgeId);

  return (
    <Container className="space-y-8 pb-6">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link href={ROUTES.courses} className="font-semibold text-primary hover:text-primary-dark">
          Courses
        </Link>
      </nav>

      <header className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,220px)] md:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">Course {course.number}</Badge>
            <DifficultyBadge difficulty={course.difficulty} />
            {course.topics.map((topic) => (
              <Badge key={topic} tone="purple">
                {topic}
              </Badge>
            ))}
          </div>

          <h1 className="section-title mt-3 font-heading font-bold">{course.title}</h1>
          <p className="body-large mt-2 text-ink-soft">{course.tagline}</p>

          <p className="mt-3 text-sm font-bold text-ink-muted">
            {course.lessons.length} missions · {formatDuration(courseVideoSeconds(course))} of film ·{' '}
            {courseTotalXp(course)} XP · about {courseTime(course)}
          </p>

          <div className="mt-5 max-w-sm">
            <ProgressBar value={doneSteps} max={totalSteps} label={`${course.title} progress`} />
            <p className="mt-1.5 text-sm font-semibold text-ink-muted">
              {doneSteps} of {totalSteps} complete, including the final project
            </p>
          </div>

          {nextLesson ? (
            <ButtonLink
              href={`${ROUTES.courses}/${course.id}/${nextLesson.id}`}
              size="lg"
              className="mt-5"
            >
              {doneCount === 0 ? 'Start the first mission' : 'Continue where you left off'}
              <ArrowRight className="size-5" aria-hidden="true" />
            </ButtonLink>
          ) : (
            <ButtonLink href={`${ROUTES.courses}/${course.id}/capstone`} size="lg" className="mt-5">
              {capstoneDone ? 'Revisit the final project' : 'Start the final project'}
              <ArrowRight className="size-5" aria-hidden="true" />
            </ButtonLink>
          )}
        </div>

        <Image
          {...img(course.image)}
          alt=""
          aria-hidden="true"
          sizes="240px"
          className="mx-auto h-40 w-auto object-contain md:h-48"
        />
      </header>

      <section aria-labelledby="outcomes-heading">
        <Card className="bg-primary-surface">
          <h2 id="outcomes-heading" className="card-title font-heading">
            By the end of this course you can
          </h2>
          <ul className="mt-3 space-y-2">
            {course.outcomes.map((outcome) => (
              <li key={outcome} className="flex gap-2 leading-relaxed">
                <Check className="mt-1 size-4 shrink-0 text-grass-dark" aria-hidden="true" />
                {outcome}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section aria-labelledby="lessons-heading">
        <h2 id="lessons-heading" className="section-title font-heading font-bold">
          Missions
        </h2>

        <ol className="mt-5 space-y-3">
          {course.lessons.map((lesson) => {
            const done = isDone(lesson.id);
            const badge = findBadge(lesson.badgeId);

            return (
              <li key={lesson.id}>
                <Link
                  href={`${ROUTES.courses}/${course.id}/${lesson.id}`}
                  className={cn(
                    'flex flex-wrap items-center gap-4 rounded-card border p-4 shadow-card',
                    'transition-[transform,border-color,box-shadow] duration-200',
                    'hover:-translate-y-0.5 hover:shadow-card-hover motion-reduce:hover:translate-y-0',
                    done
                      ? 'border-grass bg-grass-light'
                      : 'border-border-soft bg-surface hover:border-primary/40',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-11 shrink-0 items-center justify-center rounded-full font-heading text-lg font-bold',
                      done ? 'bg-grass text-white' : 'bg-primary-surface text-primary-dark',
                    )}
                  >
                    {done ? <Check className="size-5" aria-hidden="true" /> : lesson.number}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-heading font-bold">{lesson.title}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-soft">
                      <Clock className="size-3.5 shrink-0" aria-hidden="true" />
                      {formatDuration(lesson.video.durationSeconds)} film · {lesson.learnerTime} in
                      total
                    </span>
                    {/* State is spelled out, never signalled by colour alone. */}
                    <span className="mt-1 block text-xs font-semibold text-ink-muted">
                      {done ? 'Complete' : 'Not started'} · +{lesson.xpReward} XP
                    </span>
                  </span>

                  {badge ? (
                    <span className="flex items-center gap-2 text-sm">
                      <span className={cn('text-2xl', !done && 'grayscale')} aria-hidden="true">
                        {badge.emoji}
                      </span>
                      <span className="font-semibold text-ink-muted">{badge.name}</span>
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* The capstone is a stage of the course, not an extra. */}
      <section aria-labelledby="capstone-heading">
        <Link
          href={`${ROUTES.courses}/${course.id}/capstone`}
          className={cn(
            'flex flex-wrap items-center gap-4 rounded-card border-2 p-5 shadow-card',
            'transition-[transform,border-color,box-shadow] duration-200',
            'hover:-translate-y-0.5 hover:shadow-card-hover motion-reduce:hover:translate-y-0',
            capstoneDone ? 'border-grass bg-grass-light' : 'border-sunshine bg-sunshine-light',
          )}
        >
          <span className="text-4xl" aria-hidden="true">
            {capstoneBadge?.emoji ?? '🏅'}
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-xs font-bold uppercase tracking-wide text-sunshine-dark">
              Final project · {course.capstone.time}
            </span>
            <span id="capstone-heading" className="mt-1 block card-title font-heading">
              {course.capstone.title}
            </span>
            <span className="mt-1 block text-sm text-ink-soft">{course.capstone.summary}</span>
            <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
              {doneCount < course.lessons.length && !capstoneDone ? (
                <>
                  <Lock className="size-3.5" aria-hidden="true" />
                  Unlocks after all {course.lessons.length} missions
                </>
              ) : (
                <>
                  <Target className="size-3.5" aria-hidden="true" />
                  {capstoneDone ? 'Complete' : 'Ready to start'} · +{course.capstone.xpReward} XP
                </>
              )}
            </span>
          </span>
        </Link>
      </section>
    </Container>
  );
}
