import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Form controls for the Creative Studio and anything that follows it.
 *
 * There is deliberately no dropdown here. A native `<select>` hands its open
 * list to the operating system — square corners, a hard blue highlight, rows
 * far below a comfortable touch target — and no CSS can reach it. Building a
 * custom one would fix the look but keep the real problem: a dropdown hides
 * every option behind a tap, and asks a six-year-old to remember what was in
 * there while deciding.
 *
 * With five or six short options, showing them all is simply better. And
 * because `ChoiceGroup` is built on real radio inputs, arrow-key navigation,
 * screen reader announcements, and form semantics all come for free — the exact
 * things a hand-rolled listbox tends to get wrong.
 */

const FIELD_BASE =
  'min-h-[48px] w-full rounded-card border-2 border-border-soft bg-surface text-base text-ink ' +
  'transition-colors duration-200 hover:border-primary/50';

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className, ...rest }: TextInputProps) {
  return (
    <input type="text" {...rest} className={cn(FIELD_BASE, 'px-4 placeholder:text-ink-muted', className)} />
  );
}

interface ChoiceGroupProps {
  /** Must be unique on the page — it is what binds the radios into one group. */
  name: string;
  legend: ReactNode;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ChoiceGroup({ name, legend, options, value, onChange, className }: ChoiceGroupProps) {
  return (
    // `min-w-0` because a fieldset defaults to `min-width: min-content`, which
    // would let a long option push the whole card wider than its column.
    <fieldset className={cn('min-w-0', className)}>
      <legend className="font-heading text-sm font-bold">{legend}</legend>

      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === value;

          return (
            <label key={option} className="cursor-pointer">
              {/* `sr-only`, not `hidden`: the radio stays focusable and stays in
                  the accessibility tree, so arrow keys still move between
                  options exactly as a screen reader user expects. */}
              <input
                type="radio"
                name={name}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'flex min-h-[44px] items-center rounded-button border-2 px-4 text-sm font-semibold',
                  'transition-[transform,background-color,border-color,box-shadow] duration-200',
                  'hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
                  // The focus ring has to hang off the label, since the input
                  // it belongs to is visually hidden.
                  'peer-focus-visible:outline peer-focus-visible:outline-[3px]',
                  'peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-primary',
                  selected
                    ? 'border-primary bg-primary text-white shadow-button'
                    : 'border-border-soft bg-surface text-ink hover:border-primary/50 hover:bg-primary-surface',
                )}
              >
                {option}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
