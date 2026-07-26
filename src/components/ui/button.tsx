import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'sunshine';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-button hover:bg-primary-dark',
  secondary: 'bg-white text-primary shadow-card hover:bg-primary-light',
  outline: 'border-2 border-white/70 bg-white/10 text-white hover:bg-white/20',
  ghost: 'text-ink hover:bg-primary-light hover:text-primary-dark',
  sunshine: 'bg-sunshine text-ink shadow-card hover:brightness-95',
};

const SIZES: Record<ButtonSize, string> = {
  // Every size clears the 44px minimum touch target from WCAG 2.5.5.
  sm: 'min-h-[44px] px-4 text-sm',
  md: 'min-h-[48px] px-6 text-base',
  lg: 'min-h-[56px] px-8 text-lg',
};

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-button font-heading font-semibold ' +
  'transition-[transform,background-color,box-shadow,filter] duration-200 ' +
  'hover:scale-[1.03] active:scale-100 disabled:pointer-events-none disabled:opacity-60 ' +
  'motion-reduce:hover:scale-100';

export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

type ButtonProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>;

/** Use for actions (opens a dialog, submits, toggles). */
export function Button({ variant, size, className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonStyles(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

type ButtonLinkProps = CommonProps & {
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'>;

/** Use for navigation. Renders a real anchor so middle-click and copy-link work. */
export function ButtonLink({ href, variant, size, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonStyles(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
