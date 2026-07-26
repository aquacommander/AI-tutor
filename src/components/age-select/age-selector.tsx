'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { ageGroups } from '@/data/age-groups';
import { useAgeGroup } from '@/hooks/use-age-group';
import { ROUTES, isAgeGroupId } from '@/lib/constants';
import { img } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { AgeGroupId } from '@/types/learner';

const THEMES = {
  green: { surface: 'bg-grass-surface', ring: 'ring-grass-dark', title: 'text-grass-dark', pill: 'bg-grass-dark' },
  purple: { surface: 'bg-primary-surface', ring: 'ring-primary', title: 'text-primary', pill: 'bg-primary' },
  coral: { surface: 'bg-coral-surface', ring: 'ring-coral-dark', title: 'text-coral-dark', pill: 'bg-coral-dark' },
} as const;

export function AgeSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ageGroup: savedGroup, isLoaded, setAgeGroup } = useAgeGroup();

  const requested = searchParams.get('group');
  /** Highlighted from the homepage link, or whatever was chosen previously. */
  const suggested: AgeGroupId | null = isAgeGroupId(requested)
    ? requested
    : isLoaded
      ? savedGroup
      : null;

  const choose = (id: AgeGroupId) => {
    setAgeGroup(id);
    router.push(ROUTES.dashboard);
  };

  return (
    <ul className="grid gap-4 md:gap-5 lg:grid-cols-3 lg:gap-6">
      {ageGroups.map((group) => {
        const theme = THEMES[group.theme];
        const isSuggested = suggested === group.id;
        const isSaved = isLoaded && savedGroup === group.id;
        const Icon = group.icon;

        return (
          <li key={group.id}>
            <button
              type="button"
              onClick={() => choose(group.id)}
              autoFocus={isSuggested}
              aria-describedby={`${group.id}-focus`}
              className={cn(
                'group flex h-full w-full flex-col rounded-card border border-border-soft p-6 text-left shadow-card',
                'transition-[transform,box-shadow] duration-200',
                'hover:-translate-y-1 hover:shadow-card-hover motion-reduce:hover:translate-y-0',
                theme.surface,
                isSuggested && `ring-4 ring-offset-2 ${theme.ring}`,
              )}
            >
              <div className="flex items-center justify-between gap-3">
                {/* The character carries the personality; the glyph labels the tier. */}
                <Image
                  {...img(group.characterImage)}
                  alt=""
                  aria-hidden="true"
                  sizes="180px"
                  className="h-28 w-auto object-contain"
                />
                <span className="inline-flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
                  <Icon className={cn('size-7', theme.title)} aria-hidden="true" />
                </span>

                {isSaved ? (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-button px-3 py-1 text-xs font-bold text-white',
                      theme.pill,
                    )}
                  >
                    <Check className="size-3.5" aria-hidden="true" />
                    Current
                  </span>
                ) : null}
              </div>

              <h2 className={cn('mt-5 font-heading text-2xl font-bold', theme.title)}>{group.title}</h2>
              <p className="mt-1 font-heading text-base font-semibold text-ink-soft">
                Ages {group.ageRange}
              </p>
              <p className="mt-3 leading-relaxed text-ink-soft">{group.description}</p>

              <ul id={`${group.id}-focus`} className="mt-4 space-y-1.5">
                {group.focus.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <Check className={cn('size-4 shrink-0', theme.title)} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center justify-end gap-3 pt-6">
                <span
                  className={cn(
                    'inline-flex items-center gap-2 rounded-button px-4 py-2.5 font-heading font-semibold text-white',
                    'transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100',
                    theme.pill,
                  )}
                  aria-hidden="true"
                >
                  Choose
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
