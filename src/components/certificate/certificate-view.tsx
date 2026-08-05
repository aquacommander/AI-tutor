'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Lock, Printer } from 'lucide-react';
import { ButtonLink, Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { courses, TOTAL_LESSONS } from '@/data/courses';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { AGE_GROUP_LABEL, AGE_GROUP_RANGE, ROUTES, SITE } from '@/lib/constants';
import { courseTime } from '@/lib/lesson-time';
import { img } from '@/lib/images';
import { cn } from '@/lib/utils';

/**
 * The completion certificate.
 *
 * The course plan asks for one "after all four capstones are approved", and is
 * specific about what it may claim: "state learning hours and skills, not claim
 * professional AI certification". So this lists what the child actually did and
 * carries no accreditation language at all.
 *
 * It prints. A certificate that only exists in a browser tab is not a
 * certificate to a nine-year-old — it needs to go on a wall.
 */
export function CertificateView() {
  const { learner, isLoaded } = useLearnerProgress();

  if (!isLoaded) {
    return (
      <Container>
        <div className="h-96 animate-pulse rounded-card bg-primary-surface/40" />
        <span className="sr-only">Loading your certificate</span>
      </Container>
    );
  }

  const completed = learner?.completedLessons ?? [];
  const capstonesDone = courses.filter((course) =>
    completed.includes(`capstone:${course.id}`),
  );
  const lessonsDone = courses.reduce(
    (total, course) =>
      total + course.lessons.filter((l) => completed.includes(`${course.id}/${l.id}`)).length,
    0,
  );
  const earned = capstonesDone.length === courses.length;

  // Summed from the real course times, so the hours claimed are the hours built.
  const totalHours = courses
    .map((course) => courseTime(course))
    .map((text) => Number(/(\d+(?:\.\d+)?)/.exec(text)?.[1] ?? 0))
    .reduce((total, hours) => total + hours, 0);

  if (!earned) {
    return (
      <Container className="max-w-3xl space-y-6">
        <header>
          <h1 className="section-title font-heading font-bold">Your certificate</h1>
          <p className="body-large mt-2 text-ink-soft">
            It unlocks when all four final projects are complete — one from each course.
          </p>
        </header>

        <Card className="border-sunshine bg-sunshine-light">
          <p className="flex items-center gap-2 font-heading text-lg font-bold">
            <Lock className="size-5" aria-hidden="true" />
            {capstonesDone.length} of {courses.length} final projects done
          </p>
          <ul className="mt-4 space-y-3">
            {courses.map((course) => {
              const done = completed.includes(`capstone:${course.id}`);
              return (
                <li key={course.id}>
                  <Link
                    href={`${ROUTES.courses}/${course.id}/capstone`}
                    className={cn(
                      'flex items-center gap-3 rounded-card border-2 p-4 font-heading font-bold',
                      'transition-[transform,border-color] duration-200 hover:-translate-y-0.5',
                      'motion-reduce:hover:translate-y-0',
                      done ? 'border-grass bg-grass-light' : 'border-border-soft bg-surface',
                    )}
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {done ? '✅' : '⬜'}
                    </span>
                    <span className="flex-1">{course.capstone.title}</span>
                    <span className="text-sm font-semibold text-ink-muted">{course.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

        <ButtonLink href={ROUTES.courses} size="lg">
          Back to the courses
          <ArrowRight className="size-5" aria-hidden="true" />
        </ButtonLink>
      </Container>
    );
  }

  const name = learner ? AGE_GROUP_LABEL[learner.ageGroup] : 'Learner';

  return (
    <Container className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h1 className="section-title font-heading font-bold">Your certificate</h1>
        <Button size="md" onClick={() => window.print()}>
          <Printer className="size-4" aria-hidden="true" />
          Print it
        </Button>
      </div>

      {/* The printed artefact. Everything else on the page is hidden by
          `print:hidden`, so a child gets the certificate and nothing else. */}
      <article className="rounded-large border-4 border-primary bg-surface p-8 text-center shadow-card print:border-2 print:shadow-none sm:p-12">
        <Image
          {...img('brand/wordmark.webp')}
          alt={SITE.name}
          sizes="220px"
          className="mx-auto h-12 w-auto object-contain"
        />

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-primary">
          Certificate of Completion
        </p>

        <p className="mt-6 text-lg text-ink-soft">This certifies that</p>
        <p className="mt-2 font-heading text-3xl font-bold sm:text-4xl">{name}</p>
        {learner ? (
          <p className="mt-1 text-ink-soft">Ages {AGE_GROUP_RANGE[learner.ageGroup]}</p>
        ) : null}

        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed">
          has completed all four courses of the AI for Kids programme, including{' '}
          <strong>{lessonsDone} of {TOTAL_LESSONS} missions</strong> and all{' '}
          <strong>four final projects</strong>.
        </p>

        <dl className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-4 text-left">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-muted">
              Guided learning
            </dt>
            <dd className="font-heading text-lg font-bold">about {Math.round(totalHours)} hours</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-muted">Badges</dt>
            <dd className="font-heading text-lg font-bold">
              {learner?.earnedBadges.length ?? 0} earned
            </dd>
          </div>
        </dl>

        <h2 className="mt-8 font-heading text-lg font-bold">Skills practised</h2>
        <ul className="mx-auto mt-3 grid max-w-xl gap-2 text-left sm:grid-cols-2">
          {courses.flatMap((course) =>
            course.outcomes.slice(0, 2).map((outcome) => (
              <li key={outcome} className="flex gap-2 text-sm leading-relaxed">
                <span aria-hidden="true">•</span>
                {outcome}
              </li>
            )),
          )}
        </ul>

        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {capstonesDone.map((course) => (
            <li
              key={course.id}
              className="rounded-button border-2 border-primary/30 px-4 py-2 text-sm font-bold"
            >
              {course.capstone.title}
            </li>
          ))}
        </ul>

        {/* The plan is explicit that this must not read as accreditation. */}
        <p className="mx-auto mt-8 max-w-xl border-t border-border-soft pt-4 text-xs leading-relaxed text-ink-muted">
          This certificate records hours of guided learning and the skills practised. It is not a
          professional or accredited AI qualification.
        </p>
      </article>

      <p className="text-sm text-ink-soft print:hidden">
        Well done. Show this to someone — then tell them the one thing that surprised you most.
      </p>
    </Container>
  );
}
