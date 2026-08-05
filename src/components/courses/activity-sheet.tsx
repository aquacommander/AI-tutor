'use client';

import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { ROUTES, SITE } from '@/lib/constants';
import type { Course, Lesson } from '@/types/course';

/**
 * The printable activity sheet.
 *
 * The course plan asks for "downloadable or interactive activity materials". The
 * interactive half is the on-screen game; this is the other half — a worksheet a
 * tutor can run in a classroom with no screens at all.
 *
 * A dedicated page rather than a print stylesheet over the lesson, because the
 * lesson keeps its tutor notes inside a `<details>`, and a collapsed `<details>`
 * prints nothing. Chasing that with CSS produces a page that looks right in one
 * browser and empty in another.
 *
 * The answer key is on a page break of its own, so it can be left behind.
 */
export function ActivitySheet({ course, lesson }: { course: Course; lesson: Lesson }) {
  return (
    <Container className="max-w-3xl space-y-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href={`${ROUTES.courses}/${course.id}/${lesson.id}`}
          className="inline-flex min-h-[44px] items-center gap-1.5 font-bold text-primary hover:text-primary-dark"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to the mission
        </Link>
        <Button size="md" onClick={() => window.print()}>
          <Printer className="size-4" aria-hidden="true" />
          Print this sheet
        </Button>
      </div>

      <article className="space-y-6 print:text-[11pt]">
        <header className="border-b-2 border-ink pb-4">
          <p className="text-sm font-bold uppercase tracking-wide text-ink-muted">
            {SITE.name} · {course.title} · Mission {lesson.number}
          </p>
          <h1 className="mt-1 font-heading text-3xl font-bold">{lesson.title}</h1>
          <p className="mt-2 text-ink-soft">
            {lesson.learnerTime} · film {Math.round(lesson.video.durationSeconds / 60)} min
          </p>
        </header>

        <Block title="Before you start — the hook">
          <p>{lesson.hook}</p>
          <p className="mt-2 text-ink-muted">
            Do not define anything yet. Let them guess first.
          </p>
        </Block>

        <Block title="The big idea">
          <p className="font-heading text-lg font-bold">{lesson.concept.bigIdea}</p>
          <p className="mt-3">
            <span className="font-bold">Words to know: </span>
            {lesson.concept.vocabulary.join(' · ')}
          </p>
          <ul className="mt-3 ml-5 list-disc space-y-1">
            {lesson.concept.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </Block>

        <Block title={`Activity — ${lesson.activity.title}`}>
          <p className="mb-2">
            <span className="font-bold">You will need: </span>
            paper, something to write with, and the cards described in the steps
          </p>
          <ol className="ml-5 list-decimal space-y-2">
            {lesson.activity.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </Block>

        <Block title="Your own mission">
          <p>{lesson.childMission}</p>
          <div className="mt-3 h-24 rounded border-2 border-dashed border-ink/30" aria-hidden="true" />
        </Block>

        <Block title="Adapting it">
          <p>
            <span className="font-bold">Ages 6–8: </span>
            {lesson.adaptation.younger}
          </p>
          <p className="mt-2">
            <span className="font-bold">Ages 13–16: </span>
            {lesson.adaptation.older}
          </p>
        </Block>

        {/* Its own page, so it can be kept back from the children. */}
        <section className="break-before-page pt-6">
          <h2 className="font-heading text-2xl font-bold">Quiz and answer key</h2>
          <p className="mt-1 text-ink-soft">
            Pass mark 4 of 5. Always give the explanation, right or wrong.
          </p>

          <ol className="mt-4 space-y-4">
            {lesson.quiz.map((question, index) => (
              <li key={question.question}>
                <p className="font-bold">
                  {index + 1}. {question.question}
                </p>
                <ul className="ml-5 mt-1 list-disc">
                  {question.options.map((option) => (
                    <li key={option} className={option === question.answer ? 'font-bold' : ''}>
                      {option}
                      {option === question.answer ? '  ✓' : ''}
                    </li>
                  ))}
                </ul>
                <p className="mt-1 text-ink-soft">
                  <span className="font-bold">Why: </span>
                  {question.explanation}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-6 border-t-2 border-ink pt-4">
            <p>
              <span className="font-bold">Misconception to watch for: </span>
              {lesson.parentTakeaway}
            </p>
          </div>
        </section>
      </article>
    </Container>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid">
      <h2 className="font-heading text-xl font-bold">{title}</h2>
      <div className="mt-2 leading-relaxed">{children}</div>
    </section>
  );
}
