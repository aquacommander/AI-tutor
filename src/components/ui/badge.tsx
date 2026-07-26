import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { LessonDifficulty } from '@/types/course';

export type BadgeTone = 'green' | 'blue' | 'purple' | 'orange' | 'neutral';

const TONES: Record<BadgeTone, string> = {
  green: 'bg-grass-light text-grass-dark',
  blue: 'bg-sky-light text-sky-dark',
  purple: 'bg-primary-light text-primary-dark',
  orange: 'bg-sunshine-light text-sunshine-dark',
  neutral: 'bg-primary-surface text-ink-soft',
};

interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-button px-3 py-1 text-xs font-bold',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Difficulty is never signalled by colour alone — each level carries its own
 * word and icon so the meaning survives greyscale and colour-blind viewing.
 */
const DIFFICULTY: Record<LessonDifficulty, { label: string; tone: BadgeTone; icon: string }> = {
  beginner: { label: 'Beginner', tone: 'green', icon: '🌱' },
  intermediate: { label: 'Intermediate', tone: 'purple', icon: '🚀' },
  advanced: { label: 'Advanced', tone: 'orange', icon: '🏅' },
};

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: LessonDifficulty;
  className?: string;
}) {
  const { label, tone, icon } = DIFFICULTY[difficulty];
  return (
    <Badge tone={tone} className={className}>
      <span aria-hidden="true">{icon}</span>
      {label}
    </Badge>
  );
}
