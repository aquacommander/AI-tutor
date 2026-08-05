import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Badge, DifficultyBadge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { courses, TOTAL_LESSONS } from '@/data/courses';
import {
  BUNDLE_DISCOUNT,
  FREE_LESSON,
  bundlePrice,
  bundleSaving,
  checkoutUrl,
  coursePrice,
  courseValue,
  enquiryEmail,
  formatPrice,
  fullPrice,
} from '@/lib/commerce';
import { ROUTES } from '@/lib/constants';
import { courseTime, formatDuration } from '@/lib/lesson-time';
import { img } from '@/lib/images';
import { cn } from '@/lib/utils';

const totalVideo = courses.reduce(
  (total, course) => total + course.lessons.reduce((t, l) => t + l.video.durationSeconds, 0),
  0,
);

export function PricingContent() {
  const bundleUrl = checkoutUrl();
  const email = enquiryEmail();

  return (
    <Container className="max-w-4xl space-y-10">
      <header className="text-center">
        <h1 className="section-title font-heading font-bold">Courses and pricing</h1>
        <p className="body-large mx-auto mt-2 max-w-2xl text-ink-soft">
          Four courses, {TOTAL_LESSONS} missions, {formatDuration(totalVideo)} of animated film, and
          around 8–9 hours of guided learning. Buy one course, or take all four.
        </p>
      </header>

      {/* The free sample comes first, because nobody buys a children's course
          sight unseen. */}
      <Card className="border-grass bg-grass-light text-center">
        <span className="block text-5xl" aria-hidden="true">
          🎁
        </span>
        <h2 className="mt-2 card-title font-heading">Try the first mission free</h2>
        <p className="mx-auto mt-2 max-w-xl leading-relaxed text-ink-soft">
          The whole of <strong>Picture Clue Patrol</strong> — the film, the sorting game, the
          challenge and the quiz. Not a preview or a trailer: the real first lesson, from start to
          finish.
        </p>
        <div className="mt-5 flex justify-center">
          <ButtonLink
            href={`${ROUTES.courses}/${FREE_LESSON.courseId}/${FREE_LESSON.lessonId}`}
            size="lg"
          >
            <Sparkles className="size-5" aria-hidden="true" />
            Start the free mission
          </ButtonLink>
        </div>
      </Card>

      {/* The bundle. */}
      <section aria-labelledby="bundle-heading">
        <Card className="border-2 border-primary bg-primary-surface">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="min-w-0">
              <Badge tone="purple">Best value · {Math.round(BUNDLE_DISCOUNT * 100)}% off</Badge>
              <h2 id="bundle-heading" className="section-title mt-3 font-heading font-bold">
                All four courses
              </h2>
              <p className="mt-2 max-w-md leading-relaxed text-ink-soft">
                The complete programme: every mission, all four final projects, every badge, and the
                certificate.
              </p>
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-ink-muted line-through">
                {formatPrice(fullPrice())}
              </p>
              <p className="font-heading text-5xl font-bold text-primary">
                {formatPrice(bundlePrice())}
              </p>
              <p className="mt-1 text-sm font-bold text-grass-dark">
                Save {formatPrice(bundleSaving())}
              </p>
            </div>
          </div>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {[
              `${TOTAL_LESSONS} missions across 4 courses`,
              `${formatDuration(totalVideo)} of animated film`,
              `${TOTAL_LESSONS * 2} hands-on activities and challenges`,
              '70 quiz questions, each with an explanation',
              '4 final projects',
              'Badges and a printable certificate',
              'Printable activity sheets for every mission',
              'Parent and teacher notes throughout',
            ].map((line) => (
              <li key={line} className="flex gap-2 leading-relaxed">
                <Check className="mt-1 size-4 shrink-0 text-grass-dark" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <BuyButton url={bundleUrl} email={email} label="Get all four courses" />
          </div>
        </Card>
      </section>

      {/* Individual courses. */}
      <section aria-labelledby="courses-heading">
        <h2 id="courses-heading" className="section-title font-heading font-bold">
          Or take them one at a time
        </h2>

        <ul className="mt-6 grid gap-5 sm:grid-cols-2">
          {courses.map((course) => {
            const value = courseValue(course);
            const url = checkoutUrl(course.id);

            return (
              <li key={course.id}>
                <Card className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Badge tone="neutral">Course {course.number}</Badge>
                      <h3 className="card-title mt-2 font-heading">{course.title}</h3>
                    </div>
                    <p className="shrink-0 font-heading text-3xl font-bold text-primary">
                      {formatPrice(coursePrice(course.id))}
                    </p>
                  </div>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                    {course.tagline}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <DifficultyBadge difficulty={course.difficulty} />
                    {course.topics.map((topic) => (
                      <Badge key={topic} tone="purple">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <ul className="mt-4 space-y-1.5 text-sm">
                    {[
                      `${value.lessons} missions · ${formatDuration(value.videoSeconds)} of film`,
                      `${value.activities} activities and challenges`,
                      `${value.quizQuestions} quiz questions`,
                      `${course.capstone.title} final project`,
                      `About ${courseTime(course)}`,
                    ].map((line) => (
                      <li key={line} className="flex gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-grass-dark" aria-hidden="true" />
                        {line}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5">
                    <BuyButton url={url} email={email} label={`Get Course ${course.number}`} small />
                  </div>

                  <Link
                    href={`${ROUTES.courses}/${course.id}`}
                    className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark"
                  >
                    See what is inside
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="section-title font-heading font-bold">
          Questions
        </h2>
        <dl className="mt-5 space-y-5">
          {[
            {
              q: 'How long does a course take?',
              a: 'Each mission is about 30 to 38 minutes, and most children do one or two a week. A single course is a few weeks; all four is a term.',
            },
            {
              q: 'What age is it for?',
              a: 'Written for 9 to 12. Every mission carries notes for adapting it for 6–8 and for 13–16, so it works across a family.',
            },
            {
              q: 'Does my child need an account?',
              a: 'No. There is no sign-up and nothing about your child is stored on a server — progress lives in your own browser.',
            },
            {
              q: 'Do we need anything else?',
              a: 'Paper and something to write with. The activities are on screen, but each one also prints if you would rather work away from a device.',
            },
            {
              q: 'Can a school or club use it?',
              a: 'Yes. Every mission has a printable sheet with the activity steps and an answer key. Get in touch about group access.',
            },
          ].map((item) => (
            <div key={item.q}>
              <dt className="font-heading text-lg font-bold">{item.q}</dt>
              <dd className="mt-1 leading-relaxed text-ink-soft">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="text-center text-sm text-ink-soft">
        Prices in USD.{' '}
        <Link href={ROUTES.terms} className="font-bold text-primary hover:text-primary-dark">
          Terms and refunds
        </Link>
        {' · '}
        <Link href={ROUTES.privacy} className="font-bold text-primary hover:text-primary-dark">
          Privacy
        </Link>
      </p>

      <Image
        {...img('rewards/gift.webp')}
        alt=""
        aria-hidden="true"
        sizes="200px"
        className="mx-auto h-28 w-auto object-contain"
      />
    </Container>
  );
}

/**
 * A buy button that tells the truth about what it can do.
 *
 * With a checkout configured it goes there. With only an address configured it
 * opens an enquiry. With neither it says the shop is not open — which is honest,
 * and a parent who clicks a dead button assumes the whole site is broken.
 */
function BuyButton({
  url,
  email,
  label,
  small,
}: {
  url: string | null;
  email: string | null;
  label: string;
  small?: boolean;
}) {
  const size = small ? 'md' : 'lg';

  if (url) {
    return (
      <ButtonLink href={url} size={size} className="w-full">
        {label}
        <ArrowRight className={cn(small ? 'size-4' : 'size-5')} aria-hidden="true" />
      </ButtonLink>
    );
  }

  if (email) {
    return (
      <ButtonLink href={`mailto:${email}?subject=${encodeURIComponent(label)}`} size={size} className="w-full">
        Ask about {label.toLowerCase()}
        <ArrowRight className={cn(small ? 'size-4' : 'size-5')} aria-hidden="true" />
      </ButtonLink>
    );
  }

  return (
    <p className="rounded-card border-2 border-dashed border-border-soft px-4 py-3 text-center text-sm font-bold text-ink-muted">
      Not on sale yet — the free mission is open to everyone
    </p>
  );
}
