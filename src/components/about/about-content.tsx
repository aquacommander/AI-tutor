import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { CHARACTERS, PIP } from '@/data/characters';
import { courses, TOTAL_LESSONS } from '@/data/courses';
import { AGE_GROUP_LABEL, AGE_GROUP_RANGE, ROUTES, SITE } from '@/lib/constants';
import { formatDuration } from '@/lib/lesson-time';
import { img } from '@/lib/images';
import type { AgeGroupId } from '@/types/learner';

const totalVideo = courses.reduce(
  (total, course) => total + course.lessons.reduce((t, l) => t + l.video.durationSeconds, 0),
  0,
);

const BANDS: AgeGroupId[] = ['explorer', 'builder', 'creator'];

/**
 * The about page.
 *
 * Deliberately free of the claims this kind of site usually makes — no learner
 * counts, no awards, no "trusted by". Everything stated here is either visible
 * in the product or a decision we actually made.
 */
export function AboutContent() {
  return (
    <Container className="max-w-3xl space-y-8">
      <header>
        <h1 className="section-title font-heading font-bold">About {SITE.name}</h1>
        <p className="body-large mt-2 text-ink-soft">
          A place for children to find out how AI really works — by playing with it, not by being
          told about it.
        </p>
      </header>

      <section aria-labelledby="believe-heading">
        <Card className="bg-primary-surface">
          <h2 id="believe-heading" className="card-title font-heading">
            What we think matters
          </h2>
          <ul className="mt-4 space-y-3">
            {[
              'Play first, explain last. A child who has already had a guess listens differently.',
              'One idea per mission. Two ideas in one lesson means neither is remembered.',
              '“I am not sure” is a good answer. Every activity here rewards saying it.',
              'AI is not alive, not always right, and not magic. We show it being wrong on purpose.',
              'Nothing about a child leaves their device.',
            ].map((line) => (
              <li key={line} className="flex gap-2 leading-relaxed">
                <Check className="mt-1 size-4 shrink-0 text-grass-dark" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section aria-labelledby="programme-heading">
        <h2 id="programme-heading" className="card-title font-heading">
          The programme
        </h2>
        <p className="mt-2 leading-relaxed text-ink-soft">
          Four courses and {TOTAL_LESSONS} missions, built around{' '}
          {formatDuration(totalVideo)} of animated film. Each mission pairs a short film with a
          hands-on activity, an independent challenge and a quiz — roughly 30 to 38 minutes. Four
          final projects turn the ideas into something a child can show somebody.
        </p>

        <ul className="mt-5 space-y-3">
          {courses.map((course) => (
            <li key={course.id}>
              <Card>
                <h3 className="font-heading font-bold">
                  {course.number}. {course.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{course.tagline}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ages-heading">
        <h2 id="ages-heading" className="card-title font-heading">
          Who it is for
        </h2>
        <p className="mt-2 leading-relaxed text-ink-soft">
          Written for ages 9–12, with every mission carrying notes for the bands either side. A
          six-year-old does the same activity with pictures and spoken answers; a fifteen-year-old
          gets the version with confidence scores and real trade-offs.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {BANDS.map((band) => (
            <li key={band} className="rounded-card bg-primary-surface p-4 text-center">
              <p className="font-heading font-bold">{AGE_GROUP_LABEL[band]}</p>
              <p className="text-sm text-ink-soft">Ages {AGE_GROUP_RANGE[band]}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="cast-heading">
        <h2 id="cast-heading" className="card-title font-heading">
          Who you will meet
        </h2>
        <ul className="mt-4 space-y-3">
          {[CHARACTERS.tutor, PIP, CHARACTERS.glitch].map((character) => (
            <li key={character.name} className="flex items-center gap-4 rounded-card bg-surface p-4 shadow-card">
              <Image
                {...img(character.avatar)}
                alt=""
                aria-hidden="true"
                sizes="72px"
                className="size-14 shrink-0 rounded-full bg-primary-surface object-cover"
              />
              <span>
                <span className="block font-heading font-bold">{character.name}</span>
                <span className="block text-sm text-ink-soft">{character.role}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="honest-heading">
        <Card className="bg-sunshine-light">
          <h2 id="honest-heading" className="card-title font-heading">
            What is not finished
          </h2>
          <p className="mt-2 leading-relaxed">
            The films do not have subtitles yet. The pictures inside the activities are stand-ins
            while the artwork is drawn. A qualified teacher is reviewing the quiz wording and the age
            adaptations before this is used in a classroom. We would rather say so than let you find
            out.
          </p>
        </Card>
      </section>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href={ROUTES.courses} size="lg">
          Start a course
          <ArrowRight className="size-5" aria-hidden="true" />
        </ButtonLink>
        <ButtonLink href={ROUTES.parents} variant="secondary" size="lg">
          For parents
        </ButtonLink>
      </div>
    </Container>
  );
}
