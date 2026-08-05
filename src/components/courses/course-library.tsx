'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, Clock } from 'lucide-react';
import { Badge, DifficultyBadge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import {
  CardGlow,
  CardShimmer,
  CardSparkles,
  enchantedArtClass,
  enchantedCardClass,
  enchantedTitleClass,
} from '@/components/ui/enchanted-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { courses, courseTotalXp, courseVideoSeconds, TOTAL_LESSONS, upcomingCourses } from '@/data/courses';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { ROUTES } from '@/lib/constants';
import { img } from '@/lib/images';
import { courseTime, formatDuration } from '@/lib/lesson-time';
import { cn } from '@/lib/utils';
import type { LessonDifficulty } from '@/types/course';

type Filter = 'all' | LessonDifficulty;

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All courses' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

const totalVideoSeconds = courses.reduce((total, course) => total + courseVideoSeconds(course), 0);

/**
 * No search box. With four courses it would be furniture — every title is
 * already on screen. It earns its place when the library outgrows one view.
 */
export function CourseLibrary() {
  const { learner } = useLearnerProgress();
  const [filter, setFilter] = useState<Filter>('all');

  const completed = learner?.completedLessons ?? [];
  const visible = courses.filter((course) => filter === 'all' || course.difficulty === filter);

  return (
    <Container className="space-y-8">
      <header>
        <h1 className="section-title font-heading font-bold">AI Courses</h1>
        <p className="body-large mt-2 max-w-2xl text-ink-soft">
          Four courses, {TOTAL_LESSONS} animated missions and four final projects — from spotting how
          AI sees the world to using it safely and fairly.
        </p>
        <p className="mt-2 text-sm font-bold text-ink-muted">
          {formatDuration(totalVideoSeconds)} of film, plus activities, quizzes and projects.
        </p>
      </header>

      <div>
        <h2 id="filter-label" className="text-xs font-bold uppercase tracking-wide text-ink-muted">
          Show me
        </h2>
        <ul aria-labelledby="filter-label" className="mt-2 flex flex-wrap gap-2">
          {FILTERS.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => setFilter(option.id)}
                aria-pressed={filter === option.id}
                className={cn(
                  'min-h-[44px] rounded-button border-2 px-4 text-sm font-semibold',
                  'transition-[transform,background-color,border-color] duration-200',
                  'hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
                  filter === option.id
                    ? 'border-primary bg-primary text-white shadow-button'
                    : 'border-border-soft bg-surface text-ink hover:border-primary/50 hover:bg-primary-surface',
                )}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((course) => {
          // The capstone counts as a step, so the bar matches the course page.
          const totalSteps = course.lessons.length + 1;
          const done =
            course.lessons.filter((lesson) => completed.includes(`${course.id}/${lesson.id}`))
              .length + (completed.includes(`capstone:${course.id}`) ? 1 : 0);

          return (
            <li key={course.id} className="group relative min-w-0">
              <CardGlow />
              <Link
                href={`${ROUTES.courses}/${course.id}`}
                className={cn(enchantedCardClass, 'bg-surface')}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-primary-surface">
                  <Image
                    {...img(course.image)}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
                    className={cn(enchantedArtClass, 'size-full object-contain')}
                  />
                  <CardShimmer />
                  <CardSparkles />
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="neutral">Course {course.number}</Badge>
                    <DifficultyBadge difficulty={course.difficulty} />
                  </div>

                  <h3 className={cn(enchantedTitleClass, 'card-title mt-3 font-heading')}>
                    {course.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-soft">
                    {course.tagline}
                  </p>

                  <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-ink-muted">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {course.lessons.length} missions · {courseTime(course)} · {courseTotalXp(course)} XP
                  </p>

                  <div className="mt-3">
                    <ProgressBar value={done} max={totalSteps} label={`${course.title} progress`} />
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
                      {done === totalSteps ? (
                        <Check className="size-3.5 text-grass-dark" aria-hidden="true" />
                      ) : null}
                      {done} of {totalSteps} complete
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <Card>
        <h2 className="card-title font-heading">Later in the programme</h2>
        <p className="mt-1.5 text-sm text-ink-soft">
          Topics we are planning once the first four courses are complete.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {upcomingCourses.map((title) => (
            <li key={title}>
              <Badge tone="neutral">{title}</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <p className="text-sm text-ink-soft">
        Not sure where to begin?{' '}
        <Link href={ROUTES.tutor} className="font-bold text-primary hover:text-primary-dark">
          Ask Sparky
          <ArrowRight className="ml-1 inline size-4" aria-hidden="true" />
        </Link>
      </p>
    </Container>
  );
}
