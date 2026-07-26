import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { ThemeName } from '@/types/learner';

const SURFACES: Record<ThemeName, string> = {
  green: 'bg-grass-surface',
  purple: 'bg-primary-surface',
  coral: 'bg-coral-surface',
  blue: 'bg-sky-surface',
  orange: 'bg-sunshine-light',
};

interface IconCircleProps {
  theme: ThemeName;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: ReactNode;
}

const SIZES = {
  sm: 'size-10',
  md: 'size-14',
  lg: 'size-16',
} as const;

/** Soft tinted disc that sits behind a feature or age-group icon. */
export function IconCircle({ theme, size = 'md', className, children }: IconCircleProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full',
        SURFACES[theme],
        SIZES[size],
        className,
      )}
    >
      {children}
    </span>
  );
}

const IMAGE_PX = { sm: 24, md: 32, lg: 40 } as const;

/**
 * Icon discs are decorative — the adjacent heading already names the item — so
 * the image carries an empty alt and the whole disc is hidden from AT.
 */
export function IconCircleImage({
  src,
  theme,
  size = 'md',
  className,
}: {
  src: string;
  theme: ThemeName;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const px = IMAGE_PX[size];
  return (
    <IconCircle theme={theme} size={size} className={className}>
      <Image src={src} alt="" aria-hidden="true" width={px} height={px} className="size-auto" />
    </IconCircle>
  );
}
