import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { img } from '@/lib/images';
import { cn } from '@/lib/utils';

/** Sparky's face on its own — used for avatars and the 404 page. */
export function SparkyAvatar({ className }: { className?: string }) {
  return (
    <Image
      {...img('brand/sparky-avatar.webp')}
      alt=""
      aria-hidden="true"
      className={cn('size-10 object-contain', className)}
    />
  );
}

interface LogoProps {
  /**
   * `horizontal` pairs the Sparky mark with the single-line wordmark and stays
   * legible in a slim header. `lockup` is the supplied brand lockup, whose
   * wordmark is stacked over two lines and needs more vertical room — use it
   * only where that room exists.
   */
  variant?: 'horizontal' | 'lockup';
  className?: string;
  priority?: boolean;
}

/**
 * Both variants already contain the words "AI for Kids", so the name lives in
 * the link's accessible label rather than being repeated as visible markup.
 *
 * `min-h` keeps the home link a 44px touch target.
 */
export function Logo({ variant = 'horizontal', className, priority = false }: LogoProps) {
  return (
    <Link
      href={ROUTES.home}
      aria-label="AI for Kids — home"
      className={cn('inline-flex min-h-[44px] items-center gap-2', className)}
    >
      {variant === 'horizontal' ? (
        <>
          <Image
            {...img('brand/sparky-avatar.webp')}
            alt=""
            aria-hidden="true"
            priority={priority}
            sizes="48px"
            className="size-9 shrink-0 object-contain sm:size-10"
          />
          <Image
            {...img('brand/wordmark.webp')}
            alt=""
            aria-hidden="true"
            priority={priority}
            sizes="(max-width: 640px) 110px, 140px"
            className="h-5 w-auto sm:h-6"
          />
        </>
      ) : (
        <Image
          {...img('brand/logo.webp')}
          alt=""
          aria-hidden="true"
          priority={priority}
          sizes="200px"
          className="h-16 w-auto sm:h-20"
        />
      )}
    </Link>
  );
}
