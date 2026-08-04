'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Circle, Target } from 'lucide-react';
import { Badge, DifficultyBadge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { ProgressBar } from '@/components/ui/progress-bar';
import { courseTotalXp } from '@/data/courses';
import { findBadge } from '@/data/badges';
import { findLessonVideo } from '@/data/lesson-videos';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { ROUTES } from '@/lib/constants';
import { img } from '@/lib/images';
import { courseTime, lessonTime } from '@/lib/lesson-time';
import { cn } from '@/lib/utils';
import type { Course } from '@/types/course';

export function CourseDetail({ course }: { course: Course }) {
  const { learner } = useLearnerProgress();
  const completed = learner?.completedLessons ?? [];

  const isDone = (lessonId: string) => completed.includes(`${course.id}/${lessonId}`);
  const doneCount = course.lessons.filter((lesson) => isDone(lesson.id)).length;

  // Continue where they stopped, rather than always restarting at lesson one.
  const nextLesson = course.lessons.find((lesson) => !isDone(lesson.id)) ?? course.lessons[0];
  const courseBadge = findBadge(course.badgeId);

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
            {course.lessons.length} lessons · {courseTotalXp(course)} XP · about{' '}
            {courseTime(course.lessons, (entry) => findLessonVideo(course.id, entry.id))}
          </p>

          <div className="mt-5 max-w-sm">
            <ProgressBar
              value={doneCount}
              max={course.lessons.length}
              label={`${course.title} progress`}
            />
            <p className="mt-1.5 text-sm font-semibold text-ink-muted">
              {doneCount} of {course.lessons.length} missions complete
            </p>
          </div>

          {nextLesson ? (
            <ButtonLink
              href={`${ROUTES.courses}/${course.id}/${nextLesson.id}`}
              size="lg"
              className="mt-5"
            >
              {doneCount === 0
                ? 'Start the first mission'
                : doneCount === course.lessons.length
                  ? 'Revisit a mission'
                  : 'Continue where you left off'}
              <ArrowRight className="size-5" aria-hidden="true" />
            </ButtonLink>
          ) : null}
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
                    done ? 'border-grass bg-grass-light' : 'border-border-soft bg-surface hover:border-primary/40',
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
                      <Target className="size-3.5 shrink-0" aria-hidden="true" />
                      {lesson.mission}
                    </span>
                    {/* State is spelled out, never signalled by colour alone. */}
                    <span className="mt-1 block text-xs font-semibold text-ink-muted">
                      {done ? 'Complete' : 'Not started'} ·{' '}
                      {lessonTime(lesson, findLessonVideo(course.id, lesson.id))} · +
                      {lesson.xpReward} XP
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

      {courseBadge ? (
        <Card className="flex flex-wrap items-center gap-4 bg-sunshine-light">
          <span className="text-4xl" aria-hidden="true">
            {courseBadge.emoji}
          </span>
          <div className="min-w-0">
            <h2 className="card-title font-heading">{courseBadge.name}</h2>
            <p className="mt-1 text-sm text-ink-soft">
              {courseBadge.requirement} to earn this, plus a {course.completionXp} XP bonus.
            </p>
          </div>
        </Card>
      ) : null}
    </Container>
  );
}
