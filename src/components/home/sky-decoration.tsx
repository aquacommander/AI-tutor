import { cn } from '@/lib/utils';

/**
 * Ambient sky: soft cloud shapes and twinkling stars, drawn with CSS rather
 * than image files so they scale to any viewport at no network cost. Purely
 * decorative and hidden from assistive technology.
 *
 * Star positions are a fixed literal — a random layout would differ between the
 * server and client render and trip a hydration mismatch.
 */
const STARS = [
  { left: '6%', top: '18%', size: 10, delay: '0s' },
  { left: '15%', top: '52%', size: 6, delay: '0.8s' },
  { left: '28%', top: '10%', size: 8, delay: '1.6s' },
  { left: '44%', top: '30%', size: 5, delay: '0.4s' },
  { left: '58%', top: '8%', size: 9, delay: '2.1s' },
  { left: '71%', top: '38%', size: 6, delay: '1.2s' },
  { left: '83%', top: '14%', size: 11, delay: '0.2s' },
  { left: '92%', top: '46%', size: 7, delay: '1.9s' },
  { left: '36%', top: '62%', size: 5, delay: '2.6s' },
  { left: '66%', top: '58%', size: 8, delay: '0.9s' },
];

export function SkyDecoration({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {STARS.map((star) => (
        <span
          key={`${star.left}-${star.top}`}
          className="absolute animate-twinkle"
          style={{ left: star.left, top: star.top, animationDelay: star.delay }}
        >
          <svg width={star.size * 2} height={star.size * 2} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 0c.6 6.2 5.2 10.8 12 12-6.8 1.2-11.4 5.8-12 12-.6-6.2-5.2-10.8-12-12C6.8 10.8 11.4 6.2 12 0Z"
              fill="#ffffff"
              fillOpacity="0.9"
            />
          </svg>
        </span>
      ))}

      {/*
        Cloud band that blends the sky gradient into the page background. The
        blobs drift against the scroll at two different rates, which reads as
        depth without anything actually moving on the main thread.
      */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      <div className="drift-slow absolute -bottom-16 -left-24 size-72 rounded-full bg-white/70 blur-2xl" />
      <div className="drift-fast absolute -bottom-24 left-1/3 size-80 rounded-full bg-white/60 blur-2xl" />
      <div className="drift-slow absolute -bottom-20 -right-16 size-72 rounded-full bg-white/70 blur-2xl" />
    </div>
  );
}
