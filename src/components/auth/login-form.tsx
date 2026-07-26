'use client';

import { useState } from 'react';
import { Info, Sparkles } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/lib/constants';

/**
 * The form is scaffolded UI only — there is no auth backend until v1.1.
 * It never accepts credentials or implies a session was created; submitting
 * states plainly that accounts are not live and points at guest access.
 */
export function LoginForm() {
  const [showNotice, setShowNotice] = useState(false);

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="section-title font-heading font-bold">Welcome back</h1>
        <p className="mt-2 text-ink-soft">
          You do not need an account to learn. Guest mode gives you every lesson, challenge, and
          creative tool right away.
        </p>

        <ButtonLink href={ROUTES.ageSelect} size="lg" className="mt-6 w-full">
          <Sparkles className="size-5" aria-hidden="true" />
          Start learning as a guest
        </ButtonLink>

        <div className="my-6 flex items-center gap-3 text-sm text-ink-muted">
          <span className="h-px flex-1 bg-border-soft" />
          or sign in
          <span className="h-px flex-1 bg-border-soft" />
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            setShowNotice(true);
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="block font-heading font-semibold">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-border-soft bg-white px-4 text-ink placeholder:text-ink-muted"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-heading font-semibold">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-border-soft bg-white px-4 text-ink placeholder:text-ink-muted"
            />
          </div>

          <Button type="submit" variant="secondary" size="md" className="w-full">
            Sign in
          </Button>
        </form>

        <p
          role="status"
          className="mt-4 flex gap-2 rounded-xl bg-sunshine-light p-3 text-sm text-ink-soft"
        >
          <Info className="mt-0.5 size-4 shrink-0 text-sunshine-dark" aria-hidden="true" />
          <span>
            {showNotice
              ? 'Accounts are not switched on yet — sign-in and progress sync arrive in v1.1. Use guest mode above to start now.'
              : 'Accounts arrive in v1.1 with parental consent for younger learners. This form is not connected yet.'}
          </span>
        </p>
      </Card>
    </div>
  );
}
