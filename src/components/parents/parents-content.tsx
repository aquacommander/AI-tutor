'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, Clock, Download, ShieldCheck, Trash2 } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { courses, TOTAL_LESSONS } from '@/data/courses';
import { useLearnerProgress } from '@/hooks/use-learner-progress';
import { ROUTES } from '@/lib/constants';
import { courseTime, formatDuration } from '@/lib/lesson-time';
import { img } from '@/lib/images';

const totalVideo = courses.reduce(
  (total, course) => total + course.lessons.reduce((t, l) => t + l.video.durationSeconds, 0),
  0,
);

/**
 * The page for the adult.
 *
 * Three jobs: explain what the programme actually is, show what this child has
 * done, and give a parent a real control over the data — the erase button that
 * the privacy policy promises. Everything here is the honest version, including
 * the parts that are not finished.
 */
export function ParentsContent() {
  const { learner, isLoaded, reset } = useLearnerProgress();
  const [confirming, setConfirming] = useState(false);
  const [erased, setErased] = useState(false);

  const completed = learner?.completedLessons ?? [];
  const lessonsDone = courses.reduce(
    (total, course) =>
      total + course.lessons.filter((l) => completed.includes(`${course.id}/${l.id}`)).length,
    0,
  );

  return (
    <Container className="max-w-3xl space-y-8">
      <header>
        <h1 className="section-title font-heading font-bold">For parents and teachers</h1>
        <p className="body-large mt-2 text-ink-soft">
          What your child is learning, how long it takes, and what we do — and do not — keep.
        </p>
      </header>

      <section aria-labelledby="what-heading">
        <Card>
          <h2 id="what-heading" className="card-title font-heading">
            What the programme is
          </h2>
          <p className="mt-2 leading-relaxed text-ink-soft">
            Four courses and {TOTAL_LESSONS} missions for ages 9–12, adaptable for 6–8 and 13–16.
            Each mission is a short animated film followed by a hands-on activity, an independent
            challenge and a quiz. Four final projects turn the ideas into something your child can
            show you.
          </p>

          <dl className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Missions', value: `${TOTAL_LESSONS}` },
              { label: 'Film', value: formatDuration(totalVideo) },
              { label: 'Guided learning', value: '8–9 hours' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-card bg-primary-surface p-4 text-center">
                <dt className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-heading text-xl font-bold">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-5 space-y-3">
            {courses.map((course) => (
              <li key={course.id} className="flex flex-wrap items-center gap-3">
                <span className="font-heading font-bold">{course.title}</span>
                <span className="text-sm text-ink-soft">
                  {course.lessons.length} missions · about {courseTime(course)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* What this child has actually done. */}
      {isLoaded && learner ? (
        <section aria-labelledby="progress-heading">
          <Card className="bg-grass-light">
            <h2 id="progress-heading" className="card-title font-heading">
              How your child is getting on
            </h2>
            <p className="mt-2 text-ink-soft">
              {lessonsDone} of {TOTAL_LESSONS} missions complete · {learner.earnedBadges.length}{' '}
              badges · {learner.progress.streakDays}-day streak
            </p>

            {learner.recentActivity.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {learner.recentActivity.map((entry) => (
                  <li key={`${entry.id}-${entry.occurredAt}`} className="flex items-start gap-2">
                    <Check className="mt-1 size-4 shrink-0 text-grass-dark" aria-hidden="true" />
                    <span>
                      <span className="font-semibold">{entry.label}</span>{' '}
                      <span className="text-sm text-ink-soft">{entry.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="mt-4 text-sm text-ink-soft">
              Every mission has a &ldquo;For grown-ups and tutors&rdquo; panel with what it teaches,
              how to adapt it for a younger or older child, and the misconception it corrects.
            </p>
          </Card>
        </section>
      ) : null}

      <section aria-labelledby="offline-heading">
        <Card>
          <h2 id="offline-heading" className="card-title font-heading">
            <Download className="mr-2 inline size-5 text-primary" aria-hidden="true" />
            Away from the screen
          </h2>
          <p className="mt-2 leading-relaxed text-ink-soft">
            Every mission has a printable sheet: the hook, the big idea, the activity steps, the
            independent mission, the age adaptations, and a quiz answer key on its own page so you
            can keep it back. Open any mission, expand{' '}
            <strong>For grown-ups and tutors</strong>, and follow{' '}
            <strong>Printable activity sheet</strong>.
          </p>
        </Card>
      </section>

      <section aria-labelledby="privacy-heading">
        <Card>
          <h2 id="privacy-heading" className="card-title font-heading">
            <ShieldCheck className="mr-2 inline size-5 text-grass-dark" aria-hidden="true" />
            What we keep
          </h2>
          <ul className="mt-3 space-y-2 leading-relaxed">
            <li className="flex gap-2">
              <Check className="mt-1 size-4 shrink-0 text-grass-dark" aria-hidden="true" />
              No account, no sign-up, no email address.
            </li>
            <li className="flex gap-2">
              <Check className="mt-1 size-4 shrink-0 text-grass-dark" aria-hidden="true" />
              Progress is stored in this browser only, never sent to a server.
            </li>
            <li className="flex gap-2">
              <Check className="mt-1 size-4 shrink-0 text-grass-dark" aria-hidden="true" />
              No advertising, no tracking scripts, no third-party analytics.
            </li>
            <li className="flex gap-2">
              <Check className="mt-1 size-4 shrink-0 text-grass-dark" aria-hidden="true" />
              Sparky never asks for a name, school or address — and says so if a child offers one.
            </li>
          </ul>
          <Link
            href={ROUTES.privacy}
            className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 font-bold text-primary hover:text-primary-dark"
          >
            Read the full privacy notice
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Card>
      </section>

      {/* The control the privacy notice promises. */}
      <section aria-labelledby="erase-heading">
        <Card className="border-coral/40">
          <h2 id="erase-heading" className="card-title font-heading">
            <Trash2 className="mr-2 inline size-5 text-coral-dark" aria-hidden="true" />
            Erase everything
          </h2>
          <p className="mt-2 leading-relaxed text-ink-soft">
            Removes all progress, badges and activity records from this browser. There is no copy
            anywhere else, so this cannot be undone.
          </p>

          {erased ? (
            <p role="status" className="mt-4 rounded-card bg-grass-light p-4 font-heading font-bold">
              Erased. This browser now holds nothing about your child.
            </p>
          ) : confirming ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                size="md"
                onClick={() => {
                  reset();
                  setErased(true);
                  setConfirming(false);
                }}
              >
                Yes, erase it all
              </Button>
              <Button variant="ghost" size="md" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="secondary" size="md" onClick={() => setConfirming(true)} className="mt-4">
              <Trash2 className="size-4" aria-hidden="true" />
              Erase my child&rsquo;s data
            </Button>
          )}
        </Card>
      </section>

      <section aria-labelledby="review-heading">
        <Card className="bg-sunshine-light">
          <h2 id="review-heading" className="card-title font-heading">
            <Clock className="mr-2 inline size-5 text-sunshine-dark" aria-hidden="true" />
            Still to come
          </h2>
          <p className="mt-2 leading-relaxed">
            Being straight with you: the films do not yet have subtitles, and the illustrations in
            the activities are placeholders while the artwork is produced. A qualified teacher is
            reviewing the quiz wording and age adaptations before this is used in a classroom.
          </p>
        </Card>
      </section>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href={ROUTES.courses} size="lg">
          See the courses
          <ArrowRight className="size-5" aria-hidden="true" />
        </ButtonLink>
        <ButtonLink href={ROUTES.about} variant="secondary" size="lg">
          About us
        </ButtonLink>
      </div>

      <Image
        {...img('safety/family.webp')}
        alt=""
        aria-hidden="true"
        sizes="320px"
        className="mx-auto h-40 w-auto object-contain"
      />
    </Container>
  );
}
