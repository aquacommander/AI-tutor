'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  /** Stagger sibling reveals by a few tens of ms so a row arrives as a wave. */
  delay?: number;
  as?: ElementType;
  className?: string;
}

/**
 * Fades and lifts its children into place the first time they scroll into view.
 *
 * Children are passed through untouched, so wrapping a server component in
 * `Reveal` does not turn it into a client component — only this thin wrapper
 * ships to the browser.
 *
 * The observer disconnects after firing: the animation is a one-time settle,
 * not something that replays every time the section scrolls past.
 */
export function Reveal({ children, delay = 0, as: Tag = 'div', className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Someone who asked for reduced motion should never wait on an observer.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    // Anything already on screen at load — the hero, mainly — settles in
    // immediately rather than waiting for a scroll that may never come.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setIsVisible(true);
          observer.disconnect();
        }
      },
      // Fires a little before the element is fully in view, so the motion has
      // finished by the time the reader's eye reaches it.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn('reveal', isVisible && 'is-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
