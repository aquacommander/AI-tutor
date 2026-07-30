import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  as?: ElementType;
  className?: string;
  /** Adds the hover lift used by clickable cards. Omit for static panels. */
  interactive?: boolean;
  /** For panels that announce themselves, e.g. `status` or `alert`. */
  role?: string;
  /** Names the panel when it is rendered as a `section`. */
  'aria-labelledby'?: string;
  children: ReactNode;
}

export function Card({
  as: Tag = 'div',
  className,
  interactive = false,
  role,
  'aria-labelledby': labelledBy,
  children,
}: CardProps) {
  return (
    <Tag
      role={role}
      aria-labelledby={labelledBy}
      className={cn(
        'rounded-card border border-border-soft bg-surface p-5 shadow-card',
        interactive &&
          'transition-[transform,box-shadow,border-color] duration-200 ' +
            'hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover ' +
            'motion-reduce:hover:translate-y-0',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
