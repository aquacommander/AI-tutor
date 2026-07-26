import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AgeSelector } from '@/components/age-select/age-selector';
import { SiteFooter } from '@/components/home/site-footer';
import { SiteHeader } from '@/components/home/site-header';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Choose your age group',
  description:
    'Pick Explorer, Builder, or Creator so lessons, language, and challenges match your level.',
};

export default function AgeSelectPage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" className="py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="section-title font-heading font-bold">How old are you?</h1>
            <p className="body-large mt-3 text-ink-soft">
              Pick the group that fits you best. This shapes your lessons, the words Sparky uses, and
              how tricky the challenges get. You can change it any time.
            </p>
          </div>

          <div className="mt-10">
            {/* useSearchParams needs a Suspense boundary to keep this page static. */}
            <Suspense fallback={<SelectorSkeleton />}>
              <AgeSelector />
            </Suspense>
          </div>

          <p className="mx-auto mt-10 max-w-xl text-center text-sm text-ink-muted">
            No account needed. Your choice is saved on this device only — nothing is sent to a server.
          </p>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}

function SelectorSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-4 md:gap-5 lg:grid-cols-3 lg:gap-6">
      {[0, 1, 2].map((index) => (
        <div key={index} className="h-[420px] rounded-card border border-border-soft bg-primary-surface" />
      ))}
    </div>
  );
}
