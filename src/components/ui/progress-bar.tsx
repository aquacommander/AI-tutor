import { cn, toPercent } from '@/lib/utils';

export type ProgressTone = 'primary' | 'sunshine' | 'grass' | 'white';

const TRACK: Record<ProgressTone, string> = {
  primary: 'bg-primary-light',
  sunshine: 'bg-white/25',
  grass: 'bg-grass-light',
  white: 'bg-white/25',
};

const FILL: Record<ProgressTone, string> = {
  primary: 'bg-primary',
  sunshine: 'bg-sunshine',
  grass: 'bg-grass',
  white: 'bg-white',
};

interface ProgressBarProps {
  value: number;
  max: number;
  /** Describes what is progressing, e.g. "XP toward level 4". Required for AT. */
  label: string;
  tone?: ProgressTone;
  className?: string;
  /** Animate the fill in on mount. Disabled automatically under reduced motion. */
  animate?: boolean;
}

export function ProgressBar({
  value,
  max,
  label,
  tone = 'primary',
  className,
  animate = true,
}: ProgressBarProps) {
  const percent = toPercent(value, max);

  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('h-2.5 w-full overflow-hidden rounded-button', TRACK[tone], className)}
    >
      <div
        className={cn(
          'h-full rounded-button',
          FILL[tone],
          animate && 'transition-[width] duration-700 ease-out motion-reduce:transition-none',
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
