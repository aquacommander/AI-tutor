import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  CardGlow,
  CardShimmer,
  CardSparkles,
  enchantedArtClass,
  enchantedCardClass,
  enchantedTitleClass,
} from '@/components/ui/enchanted-card';
import { Reveal } from '@/components/ui/reveal';
import { img } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { AgeGroupCardData } from '@/types/homepage';

/**
 * Arrow discs use the `-dark` tokens: white on the base tints falls under the
 * 3:1 that WCAG 1.4.11 asks of meaningful graphics.
 */
const THEMES = {
  green: {
    surface: 'bg-grass-surface',
    title: 'text-grass-dark',
    icon: 'bg-white text-grass-dark',
    arrow: 'bg-grass-dark',
  },
  purple: {
    surface: 'bg-primary-surface',
    title: 'text-primary',
    icon: 'bg-white text-primary',
    arrow: 'bg-primary',
  },
  coral: {
    surface: 'bg-coral-surface',
    title: 'text-coral-dark',
    icon: 'bg-white text-coral-dark',
    arrow: 'bg-coral-dark',
  },
} as const;

export function AgeGroupCard({ group, index = 0 }: { group: AgeGroupCardData; index?: number }) {
  const theme = THEMES[group.theme];
  const Icon = group.icon;

  return (
    <li className="group relative">
      {/* Cards arrive as a left-to-right wave rather than all at once. */}
      <Reveal delay={index * 90} className="relative h-full">
        <CardGlow />

        <Link
          href={group.href}
          className={cn(enchantedCardClass, theme.surface, 'min-h-[190px] p-5')}
        >
          <div className="flex items-start gap-4">
            <span
              className={cn(
                'inline-flex size-14 shrink-0 items-center justify-center rounded-full shadow-sm',
                'transition-transform duration-500 ease-out',
                'group-hover:-rotate-6 group-hover:scale-110',
                'motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100',
                theme.icon,
              )}
            >
              <Icon className="size-7" aria-hidden="true" />
            </span>

            <div className="min-w-0">
              <h3 className={cn(enchantedTitleClass, 'card-title font-heading', theme.title)}>
                {group.title} {group.ageRange}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{group.description}</p>
            </div>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 pt-4">
            {/* The character is this card's artwork, so the magic happens here. */}
            <span className="relative inline-flex h-20 shrink-0 overflow-hidden rounded-2xl">
              <Image
                {...img(group.characterImage)}
                alt=""
                aria-hidden="true"
                sizes="140px"
                className={cn(enchantedArtClass, 'h-full w-auto object-contain')}
              />
              <CardShimmer />
              <CardSparkles variant="compact" />
            </span>

            {/* Decorative: the whole card is the link, so this is not focusable. */}
            <span
              className={cn(
                'inline-flex size-11 shrink-0 items-center justify-center rounded-full text-white',
                'transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100',
                theme.arrow,
              )}
              aria-hidden="true"
            >
              <ArrowRight className="size-5" />
            </span>
          </div>

          {/* Focus areas are useful to parents but would crowd the card visually. */}
          <span className="sr-only">Focus areas: {group.focus.join(', ')}.</span>
        </Link>
      </Reveal>
    </li>
  );
}
