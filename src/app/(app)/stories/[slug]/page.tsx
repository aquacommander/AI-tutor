import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock, MessageCircleQuestion, Sparkles, Wand2 } from 'lucide-react';
import { RichText } from '@/components/stories/rich-text';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { getStory, stories } from '@/data/stories';
import { AGE_GROUP_LABEL, ROUTES } from '@/lib/constants';
import { img } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { StoryBlock } from '@/types/story';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const story = getStory(params.slug);
  if (!story) return { title: 'Story not found' };

  return {
    title: story.title,
    description: `${story.subtitle}. A fairy tale about ${story.concept.toLowerCase()}.`,
    openGraph: { title: story.title, description: story.teaser },
  };
}

const ACCENTS = {
  green: { tint: 'bg-grass-surface', text: 'text-grass-dark', bar: 'bg-grass-dark' },
  blue: { tint: 'bg-sky-surface', text: 'text-sky-dark', bar: 'bg-sky-dark' },
  purple: { tint: 'bg-primary-surface', text: 'text-primary', bar: 'bg-primary' },
  orange: { tint: 'bg-sunshine-light', text: 'text-sunshine-dark', bar: 'bg-sunshine-dark' },
} as const;

export default function StoryPage({ params }: PageProps) {
  const story = getStory(params.slug);
  if (!story) notFound();

  const accent = ACCENTS[story.accent];
  const index = stories.findIndex((entry) => entry.slug === story.slug);
  const previous = index > 0 ? stories[index - 1] : undefined;
  const next = index < stories.length - 1 ? stories[index + 1] : undefined;

  return (
    <>
      {/* Scroll-driven, compositor-only. Hidden where unsupported. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1">
        <div className={cn('reading-progress h-full w-full', accent.bar)} aria-hidden="true" />
      </div>

      <Container>
        <Link
          href={ROUTES.stories}
          className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-primary hover:text-primary-dark"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to the story shelf
        </Link>

        <article className="mx-auto mt-6 max-w-3xl">
          <header className="text-center">
            <p className={cn('font-heading text-sm font-bold uppercase tracking-[0.2em]', accent.text)}>
              A fairy tale
            </p>
            <h1 className="section-title mt-3 font-heading font-bold">{story.title}</h1>
            <p className="body-large mt-3 italic text-ink-soft">{story.subtitle}</p>

            <dl className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-ink-muted">
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Reading time</dt>
                <Clock className="size-4" aria-hidden="true" />
                <dd>{story.readingMinutes} min read</dd>
              </div>
              <div>
                <dt className="sr-only">Best for</dt>
                <dd>{story.ageGroups.map((id) => AGE_GROUP_LABEL[id]).join(' · ')}</dd>
              </div>
            </dl>
          </header>

          <div className={cn('mt-8 overflow-hidden rounded-large', accent.tint)}>
            <Image
              {...img(story.image)}
              alt=""
              aria-hidden="true"
              priority
              sizes="(max-width: 768px) 92vw, 768px"
              className="mx-auto h-auto w-full max-w-2xl object-contain"
            />
          </div>

          <div className="tale mt-10">
            {story.blocks.map((block, blockIndex) => (
              <StoryBlockView key={blockIndex} block={block} accentText={accent.text} />
            ))}
          </div>

          <p className="tale-ornament mt-12" aria-hidden="true">
            <Wand2 className="size-5" />
          </p>

          <Reveal>
            <p className="text-center font-heading text-xl font-bold text-primary-dark">
              “{story.moral}”
            </p>
          </Reveal>

          {/* The concept, named plainly for parents, teachers, and curious readers. */}
          <Reveal>
            <section
              aria-labelledby="lesson-heading"
              className="mt-12 rounded-large border border-border-soft bg-parchment p-6 shadow-card md:p-8"
            >
              <p className="inline-flex items-center gap-2 rounded-button bg-sunshine px-3 py-1 text-xs font-bold text-ink">
                <Sparkles className="size-3.5" aria-hidden="true" />
                {story.concept}
              </p>
              <h2 id="lesson-heading" className="card-title mt-4 font-heading text-2xl">
                The lesson hidden in the tale
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed text-ink-soft">
                {story.conceptExplainer.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section aria-labelledby="ask-heading" className="mt-10">
              <h2 id="ask-heading" className="card-title font-heading text-xl">
                Ask Sparky about it
              </h2>
              <p className="mt-2 text-ink-soft">
                Take one of these to the tutor and keep the conversation going.
              </p>

              <ul className="mt-4 flex flex-wrap gap-2">
                {story.askSparky.map((question) => (
                  <li key={question}>
                    <Link
                      href={ROUTES.tutor}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-button border border-border-soft bg-surface px-4 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-primary hover:text-primary"
                    >
                      <MessageCircleQuestion className="size-4 shrink-0" aria-hidden="true" />
                      {question}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        </article>

        <nav aria-label="More stories" className="mx-auto mt-14 max-w-3xl border-t border-border-soft pt-8">
          <ul className="flex flex-wrap justify-between gap-4">
            <li>
              {previous ? (
                <Link
                  href={`${ROUTES.stories}/${previous.slug}`}
                  className="group inline-flex max-w-xs flex-col gap-1 rounded-card p-2"
                >
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-muted">
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Previous tale
                  </span>
                  <span className="font-heading font-bold text-ink group-hover:text-primary">
                    {previous.title}
                  </span>
                </Link>
              ) : null}
            </li>
            <li className="ml-auto text-right">
              {next ? (
                <Link
                  href={`${ROUTES.stories}/${next.slug}`}
                  className="group inline-flex max-w-xs flex-col items-end gap-1 rounded-card p-2"
                >
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-muted">
                    Next tale
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                  <span className="font-heading font-bold text-ink group-hover:text-primary">
                    {next.title}
                  </span>
                </Link>
              ) : null}
            </li>
          </ul>

          <div className="mt-8 flex justify-center">
            <ButtonLink href={ROUTES.stories} variant="secondary" size="md">
              All stories
            </ButtonLink>
          </div>
        </nav>
      </Container>
    </>
  );
}

function StoryBlockView({ block, accentText }: { block: StoryBlock; accentText: string }) {
  switch (block.kind) {
    case 'scene':
      return (
        <>
          <p className="tale-ornament" aria-hidden="true">
            <Sparkles className="size-4" />
          </p>
          <h2 className={cn('text-center font-heading text-xl font-bold', accentText)}>
            {block.title}
          </h2>
        </>
      );

    case 'verse':
      return (
        <p className="tale-verse">
          {block.lines.map((line, lineIndex) => (
            <span key={lineIndex} className="block">
              <RichText text={line} />
            </span>
          ))}
        </p>
      );

    case 'whisper':
      return (
        <p className="tale-whisper">
          <RichText text={block.text} />
        </p>
      );

    default:
      return (
        <p>
          <RichText text={block.text} />
        </p>
      );
  }
}
