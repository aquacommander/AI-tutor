import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Clock, Sparkles } from 'lucide-react';
import {
  CardCue,
  CardGlow,
  CardShimmer,
  CardSparkles,
  enchantedArtClass,
  enchantedCardClass,
  enchantedTitleClass,
} from '@/components/ui/enchanted-card';
import { Reveal } from '@/components/ui/reveal';
import { AGE_GROUP_LABEL, ROUTES } from '@/lib/constants';
import { img } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { Story } from '@/types/story';

const ACCENTS = {
  green: { tint: 'bg-grass-surface', text: 'text-grass-dark', pill: 'bg-grass-dark' },
  blue: { tint: 'bg-sky-surface', text: 'text-sky-dark', pill: 'bg-sky-dark' },
  purple: { tint: 'bg-primary-surface', text: 'text-primary', pill: 'bg-primary' },
  orange: { tint: 'bg-sunshine-light', text: 'text-sunshine-dark', pill: 'bg-sunshine-dark' },
} as const;

export function StoryCard({ story, index = 0 }: { story: Story; index?: number }) {
  const accent = ACCENTS[story.accent];

  return (
    <li className="group relative">
      <Reveal delay={index * 80} className="relative h-full">
        <CardGlow />

        <Link href={`${ROUTES.stories}/${story.slug}`} className={cn(enchantedCardClass, 'bg-surface')}>
          <div className={cn('relative aspect-video w-full overflow-hidden', accent.tint)}>
            <Image
              {...img(story.image)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px"
              className={cn(enchantedArtClass, 'size-full object-contain')}
            />
            <CardShimmer />
            <CardSparkles />

            <span
              className={cn(
                'absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-button px-3 py-1 text-xs font-bold text-white shadow-sm',
                accent.pill,
              )}
            >
              <Sparkles
                className="size-3.5 transition-transform duration-500 group-hover:rotate-[18deg] group-hover:scale-110 motion-reduce:group-hover:rotate-0"
                aria-hidden="true"
              />
              Fairy tale
            </span>

            <CardCue label="Read the tale" />
          </div>

          <div className="flex flex-1 flex-col p-5">
            <h3 className={cn(enchantedTitleClass, 'font-heading text-lg font-bold leading-snug')}>
              {story.title}
            </h3>
            <p className={cn('mt-1 text-sm font-semibold', accent.text)}>{story.subtitle}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{story.teaser}</p>

            <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-ink-muted">
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Reading time</dt>
                <Clock className="size-3.5" aria-hidden="true" />
                <dd>{story.readingMinutes} min read</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Hidden lesson</dt>
                <BookOpen className="size-3.5" aria-hidden="true" />
                <dd>{story.concept}</dd>
              </div>
              <div>
                <dt className="sr-only">Best for</dt>
                <dd>{story.ageGroups.map((id) => AGE_GROUP_LABEL[id]).join(' · ')}</dd>
              </div>
            </dl>
          </div>
        </Link>
      </Reveal>
    </li>
  );
}
