import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** The single content wrapper used by every section: 1240px, responsive gutters. */
export function Container({ as: Tag = 'div', className, children }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </Tag>
  );
}
