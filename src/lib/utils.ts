import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge conditional class names, letting later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 1250 -> "1,250" */
export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

/** Clamp to the 0-100 range used by every progress bar. */
export function toPercent(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
}

/** "3 days ago" style label for the activity feed. */
export function relativeTime(iso: string, now = new Date()) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';

  const diffMinutes = Math.round((then - now.getTime()) / 60_000);
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['minute', 60],
    ['hour', 24],
    ['day', 7],
    ['week', 4.35],
    ['month', 12],
  ];

  let value = diffMinutes;
  for (const [unit, step] of units) {
    if (Math.abs(value) < step) return formatter.format(value, unit);
    value = Math.round(value / step);
  }
  return formatter.format(value, 'year');
}
