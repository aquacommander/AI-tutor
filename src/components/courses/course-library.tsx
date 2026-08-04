'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, Lock } from 'lucide-react';
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
import { courses, courseTotalXp, upcomingCourses } from '@/data/courses';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { ROUTES } from '@/lib/constants';
import { img } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { LessonDifficulty } from '@/types/course';

type Filter = 'all' | LessonDifficulty;

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All courses' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

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
          Four tracks that take you from spotting how AI sees the world to building with it
          responsibly. Twenty missions in total.
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
          const total = course.lessons.length;
          const done = course.lessons.filter((lesson) =>
            completed.includes(`${course.id}/${lesson.id}`),
          ).length;
          const available = course.status === 'available';

          const body = (
            <>
              <div className="relative aspect-video w-full overflow-hidden bg-primary-surface">
                <Image
                  {...img(course.image)}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
                  className={cn(enchantedArtClass, 'size-full object-contain', !available && 'opacity-60')}
                />
                {available ? (
                  <>
                    <CardShimmer />
                    <CardSparkles />
                  </>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <DifficultyBadge difficulty={course.difficulty} />
                  {available ? null : (
                    <Badge tone="neutral">
                      <Lock className="size-3.5" aria-hidden="true" />
                      Coming soon
                    </Badge>
                  )}
                </div>

                <h3 className={cn(enchantedTitleClass, 'card-title mt-3 font-heading')}>
                  {course.title}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-soft">
                  {course.tagline}
                </p>

                <p className="mt-3 text-xs font-bold text-ink-muted">
                  {total || 5} lessons · {courseTotalXp(course)} XP
                </p>

                {available && total > 0 ? (
                  <div className="mt-3">
                    <ProgressBar value={done} max={total} label={`${course.title} progress`} />
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
                      {done === total ? (
                        <Check className="size-3.5 text-grass-dark" aria-hidden="true" />
                      ) : null}
                      {done} of {total} complete
                    </p>
                  </div>
                ) : null}
              </div>
            </>
          );

          return (
            <li key={course.id} className={cn('min-w-0', available && 'group relative')}>
              {available ? (
                <>
                  <CardGlow />
                  <Link
                    href={`${ROUTES.courses}/${course.id}`}
                    className={cn(enchantedCardClass, 'bg-surface')}
                  >
                    {body}
                  </Link>
                </>
              ) : (
                // Not a link: a card that opens onto nothing is worse than one
                // that plainly says it is not ready.
                <div className="flex h-full flex-col overflow-hidden rounded-card border border-border-soft bg-surface shadow-card">
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <Card>
        <h2 className="card-title font-heading">Later in the programme</h2>
        <p className="mt-1.5 text-sm text-ink-soft">
          Topics we are planning once the first four tracks are complete.
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
