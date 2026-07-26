'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, LogIn, Menu, Sparkles, X } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { ButtonLink } from '@/components/ui/button';
import { PRIMARY_NAV, ROUTES, type NavItem } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerId = useId();

  const isCurrent = (href: string) => pathname === href;

  // Lift the header once the page moves. Driven by an observer on a sentinel
  // rather than a scroll handler, so nothing runs on the main thread per frame.
  useEffect(() => {
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;pointer-events:none';
    document.body.prepend(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry?.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  // Navigating away must never leave the drawer or a dropdown hanging open.
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Escape closes whichever layer is open, innermost first.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (openDropdown) {
        setOpenDropdown(null);
        return;
      }
      if (isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen, openDropdown]);

  // A click anywhere outside an open desktop dropdown dismisses it.
  useEffect(() => {
    if (!openDropdown) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown-root]')) setOpenDropdown(null);
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [openDropdown]);

  // Lock the page behind the drawer and move focus into it.
  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  // Keep Tab inside the drawer while it is the only thing on screen.
  const onDrawerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Tab' || !drawerRef.current) return;

    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:pt-4">
      <nav
        aria-label="Main"
        className={cn(
          'mx-auto flex max-w-content items-center justify-between gap-4 rounded-[24px] px-4 py-3 sm:px-5 lg:px-6',
          'transition-[background-color,box-shadow,backdrop-filter] duration-300',
          isScrolled
            ? 'bg-surface/85 shadow-card backdrop-blur-md'
            : 'bg-surface shadow-header backdrop-blur-0',
        )}
      >
        {/* Above the fold on every route, so it is never lazy-loaded. */}
        <Logo priority />

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <li key={item.label} className="relative" data-dropdown-root={item.children ? '' : undefined}>
              {item.children ? (
                <DesktopDropdown
                  item={item}
                  isOpen={openDropdown === item.label}
                  onToggle={() =>
                    setOpenDropdown((current) => (current === item.label ? null : item.label))
                  }
                  isCurrent={isCurrent}
                />
              ) : (
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  className={cn(
                    'inline-flex min-h-[44px] items-center rounded-xl px-3 font-semibold transition-colors',
                    isCurrent(item.href)
                      ? 'text-primary underline decoration-2 underline-offset-8'
                      : 'text-ink-soft hover:text-primary',
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={ROUTES.login}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3 font-semibold text-ink-soft transition-colors hover:text-primary"
          >
            <LogIn className="size-4" aria-hidden="true" />
            Log In
          </Link>
          <ButtonLink href={ROUTES.ageSelect} size="sm">
            <Sparkles className="size-4" aria-hidden="true" />
            Start Learning
          </ButtonLink>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <ButtonLink href={ROUTES.ageSelect} size="sm" className="hidden px-4 sm:inline-flex">
            Start Learning
          </ButtonLink>
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls={drawerId}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex size-11 items-center justify-center rounded-xl text-ink transition-colors hover:bg-primary-light"
          >
            {isMenuOpen ? (
              <X className="size-6" aria-hidden="true" />
            ) : (
              <Menu className="size-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {isMenuOpen ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            id={drawerId}
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            onKeyDown={onDrawerKeyDown}
            className="fixed inset-x-4 top-24 z-50 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-card bg-surface p-4 shadow-card lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {PRIMARY_NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? 'page' : undefined}
                    className={cn(
                      'flex min-h-[48px] items-center rounded-xl px-4 font-heading font-semibold',
                      isCurrent(item.href)
                        ? 'bg-primary-light text-primary-dark'
                        : 'text-ink hover:bg-primary-light',
                    )}
                  >
                    {item.label}
                  </Link>

                  {item.children ? (
                    <ul className="ml-3 mt-1 flex flex-col gap-1 border-l-2 border-border-soft pl-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            aria-current={isCurrent(child.href) ? 'page' : undefined}
                            className="flex min-h-[44px] items-center rounded-xl px-3 text-sm font-semibold text-ink-soft hover:bg-primary-light hover:text-primary-dark"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-col gap-2 border-t border-border-soft pt-4">
              <Link
                href={ROUTES.login}
                className="flex min-h-[48px] items-center gap-2 rounded-xl px-4 font-heading font-semibold text-ink hover:bg-primary-light"
              >
                <LogIn className="size-4" aria-hidden="true" />
                Log In
              </Link>
              <ButtonLink href={ROUTES.ageSelect} size="md" className="w-full">
                <Sparkles className="size-4" aria-hidden="true" />
                Start Learning
              </ButtonLink>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}

function DesktopDropdown({
  item,
  isOpen,
  onToggle,
  isCurrent,
}: {
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
  isCurrent: (href: string) => boolean;
}) {
  const id = useId();
  const anyChildCurrent = item.children?.some((child) => isCurrent(child.href)) ?? false;

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={id}
        className={cn(
          'inline-flex min-h-[44px] items-center gap-1 rounded-xl px-3 font-semibold transition-colors',
          anyChildCurrent ? 'text-primary' : 'text-ink-soft hover:text-primary',
        )}
      >
        {item.label}
        <ChevronDown
          className={cn('size-4 transition-transform', isOpen && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <ul
          id={id}
          className="absolute left-0 top-full z-50 mt-2 w-72 rounded-card border border-border-soft bg-surface p-2 shadow-card"
        >
          {item.children?.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                aria-current={isCurrent(child.href) ? 'page' : undefined}
                className="block rounded-xl px-3 py-2.5 hover:bg-primary-light"
              >
                <span className="block font-heading font-semibold text-ink">{child.label}</span>
                <span className="block text-sm text-ink-soft">{child.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
