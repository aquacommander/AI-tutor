import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'center' | 'left';
  /** Set to 'h3' when the section already sits under another h2. */
  as?: 'h2' | 'h3';
  className?: string;
  id?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = 'center',
  as: Tag = 'h2',
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', align === 'center' ? 'mx-auto text-center' : 'text-left', className)}>
      <Tag id={id} className="section-title font-heading font-bold">
        {title}
      </Tag>
      {subtitle ? <p className="mt-3 text-ink-soft body-large">{subtitle}</p> : null}
    </div>
  );
}
