'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { hasScrolledPast, watchForOverscroll } from '@/lib/reveal-sweep';
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
 *
 * An observer alone is not enough — a fast scroll can carry an element from
 * below the viewport to above it without the browser ever sampling it in view,
 * leaving the content invisible for good. `watchForOverscroll` is the net that
 * catches those; see `@/lib/reveal-sweep`.
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

    // A restored scroll position or an anchor jump can land with the element
    // already above the viewport, where it will never intersect again.
    if (hasScrolledPast(element)) {
      setIsVisible(true);
      return;
    }

    let unwatch = () => {};

    const settle = () => {
      setIsVisible(true);
      observer.disconnect();
      unwatch();
    };

    // Anything already on screen at load — the hero, mainly — settles in
    // immediately rather than waiting for a scroll that may never come.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) settle();
        }
      },
      // Fires a little before the element is fully in view, so the motion has
      // finished by the time the reader's eye reaches it.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    observer.observe(element);
    unwatch = watchForOverscroll(element, settle);

    return () => {
      observer.disconnect();
      unwatch();
    };
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
