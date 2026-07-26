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
import type { FeatureCardData } from '@/types/homepage';

const THEMES = {
  blue: { surface: 'bg-sky-surface', title: 'text-sky-dark' },
  green: { surface: 'bg-grass-surface', title: 'text-grass-dark' },
  purple: { surface: 'bg-primary-surface', title: 'text-primary' },
  orange: { surface: 'bg-sunshine-light', title: 'text-sunshine-dark' },
} as const;

export function FeatureCard({ feature, index = 0 }: { feature: FeatureCardData; index?: number }) {
  const theme = THEMES[feature.theme];

  return (
    <li className="group relative">
      <Reveal delay={index * 80} className="relative h-full">
        <CardGlow />

        <Link href={feature.href} className={cn(enchantedCardClass, theme.surface, 'p-5')}>
          {/* The illustration repeats the card's title, so it is decorative. */}
          <span className="relative inline-flex size-[72px] items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-sm">
            <Image
              {...img(feature.image)}
              alt=""
              aria-hidden="true"
              sizes="80px"
              className={cn(enchantedArtClass, 'size-full object-contain')}
            />
            <CardShimmer />
            <CardSparkles variant="compact" />
          </span>

          <h3 className={cn(enchantedTitleClass, 'card-title mt-4 font-heading', theme.title)}>
            {feature.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{feature.description}</p>

          <span
            className={cn('mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold', theme.title)}
          >
            Explore
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
              aria-hidden="true"
            />
          </span>
        </Link>
      </Reveal>
    </li>
  );
}
