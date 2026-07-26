import { Sparkle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The hover treatment shared by every card on the site — stories, lessons,
 * courses, age groups and learning modules. A card behaves like a book being
 * picked up: it tips a fraction of a degree as it lifts, a warm glow wakes
 * underneath, a band of light passes across the artwork, sparkles bloom in
 * sequence, and a gold rule draws itself under the title.
 *
 * Everything animates `transform` or `opacity` only, so a grid of cards stays
 * on the compositor. `group-focus-within` mirrors `group-hover` throughout, so
 * a keyboard user gets the same response as a mouse user.
 *
 * Usage: put `group relative` on the card's wrapper, render `<CardGlow />` as a
 * sibling *before* the link, and put `<CardShimmer />` and `<CardSparkles />`
 * inside whichever `overflow-hidden` box holds the card's artwork.
 */

/**
 * Classes for the card's own link element.
 *
 * Carries no background: cards sit on white, on a tinted surface, or on an
 * accent, so the caller supplies it.
 */
export const enchantedCardClass = cn(
  'relative flex h-full flex-col overflow-hidden rounded-card border border-border-soft shadow-card',
  'transition-[transform,box-shadow,border-color] duration-500 ease-out',
  'group-hover:-translate-y-2 group-hover:-rotate-[0.6deg] group-hover:border-sunshine group-hover:shadow-card-hover',
  'group-focus-within:-translate-y-2 group-focus-within:border-sunshine group-focus-within:shadow-card-hover',
  'motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:rotate-0',
);

/**
 * Eases the artwork in as the card lifts. Sizing is left to the caller — a
 * thumbnail fills its box, an icon or character keeps its own aspect.
 */
export const enchantedArtClass = cn(
  'transition-transform duration-700 ease-out',
  'group-hover:scale-[1.07] group-focus-within:scale-[1.07]',
  'motion-reduce:group-hover:scale-100',
);

/**
 * Gold rule under the title. Drawn as an animated background width rather than
 * a pseudo-element so it underlines correctly whether the title runs to one
 * line or two.
 */
export const enchantedTitleClass = cn(
  'w-fit bg-gradient-to-r from-sunshine to-sunshine bg-[length:0%_3px] bg-left-bottom bg-no-repeat pb-1',
  'transition-[background-size] duration-500 ease-out',
  'group-hover:bg-[length:100%_3px] group-focus-within:bg-[length:100%_3px]',
);

/**
 * The warm glow that wakes under the card.
 *
 * `tight` pulls the spread in for cards inside a clipped container — a carousel
 * viewport needs `overflow-hidden` horizontally, which crops a wide glow.
 */
export function CardGlow({ tight = false }: { tight?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute rounded-[34px] opacity-0',
        tight ? '-inset-1 blur-lg' : '-inset-2 blur-xl',
        'bg-[radial-gradient(60%_60%_at_50%_50%,theme(colors.sunshine.DEFAULT),theme(colors.coral.DEFAULT)_55%,transparent_78%)]',
        'transition-opacity duration-500 ease-out',
        'group-hover:opacity-60 group-focus-within:opacity-60',
      )}
    />
  );
}

/** A band of light passing over the artwork, as if a page were turned. */
export function CardShimmer() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full -skew-x-12',
        'bg-gradient-to-r from-transparent via-white/75 to-transparent',
        'transition-transform duration-[900ms] ease-out',
        'group-hover:translate-x-[330%] group-focus-within:translate-x-[330%]',
        'motion-reduce:hidden',
      )}
    />
  );
}

/**
 * Where the sparkles bloom, and how late each one arrives.
 *
 * `artwork` spreads them across a wide 16:9 thumbnail; `compact` clusters three
 * smaller ones inside an icon or character box. Compact sparkles are gold
 * rather than white, because they sit on pale surfaces where white vanishes.
 */
const SPARKLE_SETS = {
  artwork: [
    { key: 'a1', className: 'left-[14%] top-[18%] size-5', delay: '0ms' },
    { key: 'a2', className: 'right-[18%] top-[30%] size-4', delay: '110ms' },
    { key: 'a3', className: 'left-[30%] bottom-[16%] size-3.5', delay: '220ms' },
    { key: 'a4', className: 'right-[30%] bottom-[26%] size-5', delay: '330ms' },
  ],
  compact: [
    { key: 'c1', className: 'left-[6%] top-[8%] size-3.5', delay: '0ms' },
    { key: 'c2', className: 'right-[8%] top-[30%] size-3', delay: '120ms' },
    { key: 'c3', className: 'left-[26%] bottom-[8%] size-2.5', delay: '240ms' },
  ],
} as const;

export function CardSparkles({ variant = 'artwork' }: { variant?: keyof typeof SPARKLE_SETS }) {
  const tone = variant === 'compact' ? 'fill-sunshine text-sunshine' : 'fill-white text-white';

  return (
    <>
      {SPARKLE_SETS[variant].map((sparkle) => (
        <Sparkle
          key={sparkle.key}
          aria-hidden="true"
          style={{ transitionDelay: sparkle.delay }}
          className={cn(
            'pointer-events-none absolute scale-50 opacity-0 drop-shadow',
            tone,
            'transition-[opacity,transform] duration-500 ease-out',
            'group-hover:scale-100 group-hover:opacity-100',
            'group-focus-within:scale-100 group-focus-within:opacity-100',
            'motion-reduce:hidden',
            sparkle.className,
          )}
        />
      ))}
    </>
  );
}

/**
 * The call to action that rises over the artwork on hover. Absolutely
 * positioned, so it costs no layout when it appears.
 */
export function CardCue({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'absolute bottom-3 right-3 inline-flex translate-y-2 items-center gap-1.5 rounded-button bg-ink/85 px-3 py-1.5 text-xs font-bold text-white opacity-0',
        'transition-[opacity,transform] duration-500 ease-out',
        'group-hover:translate-y-0 group-hover:opacity-100',
        'group-focus-within:translate-y-0 group-focus-within:opacity-100',
      )}
    >
      {label}
      <Sparkle className="size-3 fill-sunshine text-sunshine" />
    </span>
  );
}
