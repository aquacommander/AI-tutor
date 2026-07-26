'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { featuredLessons } from '@/data/featured-lessons';
import { cn } from '@/lib/utils';
import { LessonCard } from './lesson-card';

export function FeaturedLessons() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect).on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect).off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Left/Right move the carousel once it has keyboard focus.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollNext();
    }
  };

  return (
    <section aria-labelledby="lessons-heading" className="pb-16 md:pb-20 lg:pb-24">
      <Container>
        <SectionHeading
          id="lessons-heading"
          title="Try a Fun Lesson"
          emoji="⭐"
          subtitle="Jump into exciting activities and see what you can create!"
        />

        <div
          className="relative mt-6"
          role="group"
          aria-roledescription="carousel"
          aria-label="Featured lessons"
        >
          {/*
            `py-6`: Embla's viewport must clip horizontally, which would also
            crop the cards' hover lift and glow. The padding gives them room
            inside the visible area.
          */}
          <div className="overflow-hidden py-6" ref={emblaRef} onKeyDown={onKeyDown} tabIndex={-1}>
            <ul className="flex gap-4 md:gap-5 lg:gap-6">
              {featuredLessons.map((lesson, index) => (
                <li
                  key={lesson.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${featuredLessons.length}`}
                  className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_calc(25%-1.125rem)]"
                >
                  <LessonCard lesson={lesson} />
                </li>
              ))}
            </ul>
          </div>

          {/*
            Controls sit inside the track on small screens — hanging them off
            the edge clips them against a 320px viewport. From lg the container
            gutter is wide enough to hold them outside the cards.
          */}
          <CarouselButton
            direction="previous"
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            className="left-1 lg:left-0 lg:-translate-x-1/2"
          />
          <CarouselButton
            direction="next"
            disabled={!canScrollNext}
            onClick={scrollNext}
            className="right-1 lg:right-0 lg:translate-x-1/2"
          />
        </div>
      </Container>
    </section>
  );
}

function CarouselButton({
  direction,
  disabled,
  onClick,
  className,
}: {
  direction: 'previous' | 'next';
  disabled: boolean;
  onClick: () => void;
  className?: string;
}) {
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`View ${direction} featured lessons`}
      className={cn(
        'absolute top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full',
        'border border-border-soft bg-surface text-ink shadow-card transition-opacity',
        'hover:bg-primary-light disabled:pointer-events-none disabled:opacity-0',
        className,
      )}
    >
      <Icon className="size-6" aria-hidden="true" />
    </button>
  );
}
