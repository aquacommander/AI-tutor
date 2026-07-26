import Image from 'next/image';
import Link from 'next/link';
import { Clock, Play } from 'lucide-react';
import { DifficultyBadge } from '@/components/ui/badge';
import {
  CardGlow,
  CardShimmer,
  CardSparkles,
  enchantedArtClass,
  enchantedCardClass,
  enchantedTitleClass,
} from '@/components/ui/enchanted-card';
import { img } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { FeaturedLesson } from '@/types/course';

const ACCENTS = {
  green: 'bg-grass-dark',
  blue: 'bg-sky-dark',
  purple: 'bg-primary',
  orange: 'bg-sunshine-dark',
} as const;

/** Thumbnail artwork is transparent, so the card supplies the backdrop. */
const THUMB_TINT = {
  green: 'bg-grass-surface',
  blue: 'bg-sky-surface',
  purple: 'bg-primary-surface',
  orange: 'bg-sunshine-light',
} as const;

export function LessonCard({ lesson }: { lesson: FeaturedLesson }) {
  return (
    // `tight` glow: this card lives in a carousel whose viewport must clip
    // horizontally, so a wide aura would be cropped at the slide edges.
    <div className="group relative h-full">
      <CardGlow tight />

      <Link href={lesson.href} className={cn(enchantedCardClass, 'bg-surface')}>
        <div className={cn('relative aspect-video w-full overflow-hidden', THUMB_TINT[lesson.accent])}>
          <Image
            {...img(lesson.image)}
            alt=""
            aria-hidden="true"
            loading="lazy"
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 300px"
            className={cn(enchantedArtClass, 'size-full object-contain')}
          />
          <CardShimmer />
          <CardSparkles />

          <DifficultyBadge difficulty={lesson.difficulty} className="absolute left-2 top-2 shadow-sm" />
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-button bg-ink/80 px-2.5 py-1 text-xs font-bold text-white">
            <Clock className="size-3.5" aria-hidden="true" />
            {lesson.durationMinutes} min
          </span>
        </div>

        <div className="flex flex-1 items-end justify-between gap-3 p-4">
          <div className="min-w-0">
            <h3 className={cn(enchantedTitleClass, 'font-heading text-base font-bold text-ink')}>
              {lesson.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{lesson.description}</p>
          </div>

          {/* Decorative: the card itself is the link. */}
          <span
            aria-hidden="true"
            className={cn(
              'inline-flex size-10 shrink-0 items-center justify-center rounded-full text-white',
              'transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100',
              ACCENTS[lesson.accent],
            )}
          >
            <Play className="size-4 fill-current" />
          </span>
        </div>
      </Link>
    </div>
  );
}
