'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, Flame, Lock, Sparkles, Target } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { DifficultyBadge } from '@/components/ui/badge';
import {
  CardGlow,
  CardShimmer,
  CardSparkles,
  enchantedArtClass,
  enchantedCardClass,
  enchantedTitleClass,
} from '@/components/ui/enchanted-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { badges } from '@/data/badges';
import { courses, courseSummaries } from '@/data/courses';
import { dailyChallenges } from '@/data/daily-challenges';
import { learningFeatures } from '@/data/homepage-features';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { AGE_GROUP_LABEL, AGE_GROUP_RANGE, ROUTES } from '@/lib/constants';
import { img } from '@/lib/images';
import { cn, formatNumber, relativeTime } from '@/lib/utils';

/**
 * Denominators for the module progress bars.
 *
 * `courses` counts the lessons that are actually **playable**, not the twenty
 * the finished programme will have. Finishing everything available and still
 * reading "5 of 20" tells a child they have barely started when in fact they
 * have done the lot.
 */
const MODULE_TOTALS: Record<string, number> = {
  tutor: 1,
  code: 5,
  create: 3,
  // Every mission plus every capstone — the capstone is a real stage.
  courses: courses.reduce((total, course) => total + course.lessons.length + 1, 0),
};

export function DashboardContent() {
  const { learner, isLoaded } = useLearnerProgress();

  // Before hydration finishes, render the same "no profile yet" shell the server
  // produced. Personalised numbers only appear once real data is available.
  if (!isLoaded || !learner) {
    return (
      <Container>
        <Card className="mx-auto max-w-2xl text-center">
          <Sparkles className="mx-auto size-10 text-primary" aria-hidden="true" />
          <h1 className="section-title mt-4 font-heading font-bold">Welcome to AI for Kids</h1>
          <p className="body-large mt-3 text-ink-soft">
            Choose an age group to unlock your dashboard, track XP, and collect badges.
          </p>
          <div className="mt-6 flex justify-center">
            <ButtonLink href={ROUTES.ageSelect} size="lg">
              Choose my age group
              <ArrowRight className="size-5" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Card>
      </Container>
    );
  }

  const { progress, completedChallenges, completedLessons, earnedBadges, recentActivity } = learner;
  const challenge = dailyChallenges[learner.ageGroup];
  const capstonesDone = courses.filter((course) =>
    completedLessons.includes(`capstone:${course.id}`),
  ).length;

  const moduleProgress: Record<string, number> = {
    tutor: recentActivity.some((entry) => entry.id.startsWith('tutor')) ? 1 : 0,
    code: completedChallenges.length,
    // Counted by distinct tool, so using Story Weaver twice is not "2 of 3".
    create: new Set(
      recentActivity.filter((entry) => entry.id.startsWith('create')).map((entry) => entry.id),
    ).size,
    courses: completedLessons.length,
  };

  return (
    <Container className="space-y-10">
      {/* Welcome banner */}
      <section aria-labelledby="welcome-heading">
        <div className="rounded-large bg-gradient-to-br from-primary-dark via-primary to-sky p-6 text-white shadow-card md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="min-w-0">
              <span className="flex items-center gap-3">
                <Image
                  {...img('rewards/level-star.webp')}
                  alt=""
                  aria-hidden="true"
                  sizes="72px"
                  className="h-12 w-auto shrink-0 object-contain"
                />
                <h1 id="welcome-heading" className="font-heading text-2xl font-bold md:text-3xl">
                  Hi, {AGE_GROUP_LABEL[learner.ageGroup]}! 👋
                </h1>
              </span>
              <p className="mt-1 text-white/90">
                Ages {AGE_GROUP_RANGE[learner.ageGroup]} · Level {progress.level}
              </p>

              <div className="mt-4 max-w-xs">
                <ProgressBar
                  value={progress.currentXp}
                  max={progress.nextLevelXp}
                  tone="sunshine"
                  label={`Experience points toward level ${progress.level + 1}`}
                />
                <p className="mt-1.5 text-sm font-semibold">
                  {formatNumber(progress.currentXp)} / {formatNumber(progress.nextLevelXp)} XP
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-3 gap-4 rounded-card bg-white/10 p-4 md:gap-6">
              <StatTile
                icon={
                  <Image
                    {...img('rewards/xp-coin.webp')}
                    alt=""
                    aria-hidden="true"
                    sizes="32px"
                    className="size-6 object-contain"
                  />
                }
                value={formatNumber(progress.currentXp)}
                label="XP Points"
              />
              <StatTile
                icon={<Award className="size-5 text-sky-light" aria-hidden="true" />}
                value={formatNumber(earnedBadges.length)}
                label="Badges"
              />
              <StatTile
                icon={<Flame className="size-5 text-coral" aria-hidden="true" />}
                value={formatNumber(progress.streakDays)}
                label="Day Streak"
              />
            </dl>
          </div>
        </div>
      </section>

      {/* Daily challenge */}
      <section aria-labelledby="challenge-heading">
        <Card className="flex flex-wrap items-center justify-between gap-5 bg-sunshine-light">
          <Image
            {...img('rewards/rocket-badge.webp')}
            alt=""
            aria-hidden="true"
            sizes="96px"
            className="h-20 w-auto shrink-0 object-contain"
          />
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-1.5 rounded-button bg-sunshine px-3 py-1 text-xs font-bold text-ink">
              <Target className="size-3.5" aria-hidden="true" />
              Daily Challenge
            </p>
            <h2 id="challenge-heading" className="card-title mt-3 font-heading">
              {challenge.title}
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-soft">
              {challenge.description}
            </p>
            <p className="mt-2 text-sm font-bold text-sunshine-dark">+{challenge.xpReward} XP</p>
          </div>

          <ButtonLink href={challenge.href} size="md">
            {challenge.ctaLabel}
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </Card>
      </section>

      {/* Learning modules */}
      <section aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="section-title font-heading font-bold">
          Your learning modules
        </h2>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6">
          {learningFeatures.map((module) => {
            const done = moduleProgress[module.id] ?? 0;
            const total = MODULE_TOTALS[module.id] ?? 1;

            return (
              <li key={module.id}>
                <Link
                  href={module.href}
                  className="group flex h-full flex-col rounded-card border border-border-soft bg-surface p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover motion-reduce:hover:translate-y-0"
                >
                  <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary-surface p-1.5">
                    <Image
                      {...img(module.image)}
                      alt=""
                      aria-hidden="true"
                      sizes="72px"
                      className="size-full object-contain"
                    />
                  </span>
                  <h3 className="card-title mt-4 font-heading">{module.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm text-ink-soft">{module.description}</p>

                  <div className="mt-4">
                    <ProgressBar
                      value={done}
                      max={total}
                      label={`${module.title} progress`}
                      tone="primary"
                    />
                    <p className="mt-1.5 text-xs font-semibold text-ink-muted">
                      {done} of {total} complete
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Featured courses */}
      <section aria-labelledby="courses-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="courses-heading" className="section-title font-heading font-bold">
            Featured courses
          </h2>
          <Link
            href={ROUTES.courses}
            className="inline-flex min-h-[44px] items-center gap-1.5 font-bold text-primary hover:text-primary-dark"
          >
            Browse all courses
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6">
          {courseSummaries.map((course) => (
            <li key={course.id} className="group relative">
              <CardGlow />
              <Link href={`${ROUTES.courses}/${course.id}`} className={cn(enchantedCardClass, 'bg-surface')}>
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
                  <DifficultyBadge difficulty={course.difficulty} className="self-start" />
                  <h3 className={cn(enchantedTitleClass, 'card-title mt-3 font-heading')}>
                    {course.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-soft">
                    {course.description}
                  </p>
                  <p className="mt-3 text-xs font-bold text-ink-muted">
                    {course.lessonCount} lessons · {course.totalXp} XP
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Certificate */}
      <section aria-labelledby="certificate-heading">
        <Link
          href={ROUTES.certificate}
          className="flex flex-wrap items-center gap-4 rounded-card border-2 border-primary bg-primary-surface p-5 shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-card-hover motion-reduce:hover:translate-y-0"
        >
          <span className="text-4xl" aria-hidden="true">
            🎓
          </span>
          <span className="min-w-0 flex-1">
            <span id="certificate-heading" className="block card-title font-heading">
              Your certificate
            </span>
            <span className="mt-1 block text-sm text-ink-soft">
              {capstonesDone} of {courses.length} final projects complete
              {capstonesDone === courses.length ? ' — ready to print!' : ''}
            </span>
          </span>
          <ArrowRight className="size-5 shrink-0 text-primary" aria-hidden="true" />
        </Link>
      </section>

      {/* Badges */}
      <section aria-labelledby="badges-heading">
        <span className="flex items-center gap-3">
          <Image
            {...img('rewards/trophy.webp')}
            alt=""
            aria-hidden="true"
            sizes="64px"
            className="h-12 w-auto shrink-0 object-contain"
          />
          <h2 id="badges-heading" className="section-title font-heading font-bold">
            Badge collection
          </h2>
        </span>
        <p className="mt-2 text-ink-soft">
          {earnedBadges.length} of {badges.length} earned.
        </p>

        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-5 lg:grid-cols-8">
          {badges.map((badge) => {
            const earned = earnedBadges.includes(badge.id);
            return (
              <li key={badge.id}>
                <div
                  className={cn(
                    'flex h-full flex-col items-center rounded-card border p-4 text-center',
                    earned
                      ? 'border-sunshine bg-sunshine-light'
                      : 'border-border-soft bg-surface opacity-70',
                  )}
                >
                  <span className="relative text-3xl" aria-hidden="true">
                    <span className={cn(!earned && 'grayscale')}>{badge.emoji}</span>
                    {!earned ? (
                      <Lock className="absolute -bottom-1 -right-2 size-4 text-ink-muted" />
                    ) : null}
                  </span>
                  <p className="mt-2 font-heading text-sm font-bold">{badge.name}</p>
                  {/* State is spelled out, never signalled by dimming alone. */}
                  <p className="mt-1 text-xs text-ink-muted">
                    {earned ? 'Earned' : `Locked · ${badge.requirement}`}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Recent activity */}
      <section aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="section-title font-heading font-bold">
          Recent activity
        </h2>

        {recentActivity.length > 0 ? (
          <ul className="mt-6 space-y-3">
            {recentActivity.map((entry) => (
              <li key={`${entry.id}-${entry.occurredAt}`}>
                <Card className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="min-w-0">
                    <p className="font-heading font-bold">{entry.label}</p>
                    <p className="text-sm text-ink-soft">{entry.detail}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-grass-dark">+{entry.xpEarned} XP</p>
                    <p className="text-xs text-ink-muted">{relativeTime(entry.occurredAt)}</p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <Card className="mt-6 text-center">
            <p className="text-ink-soft">
              Nothing here yet. Finish a lesson or a Code Lab challenge and it will show up.
            </p>
            <div className="mt-4 flex justify-center">
              <ButtonLink href={ROUTES.courses} size="md" variant="secondary">
                Find a course
              </ButtonLink>
            </div>
          </Card>
        )}
      </section>
    </Container>
  );
}

function StatTile({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-center">
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="flex items-center justify-center gap-1.5">
          {icon}
          <span className="font-heading text-2xl font-bold">{value}</span>
        </span>
        <span aria-hidden="true" className="mt-0.5 block text-xs font-semibold text-white/80">
          {label}
        </span>
      </dd>
    </div>
  );
}
