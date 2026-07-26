import type { Metadata } from 'next';
import { SiteFooter } from '@/components/home/site-footer';
import { SiteHeader } from '@/components/home/site-header';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { SparkyAvatar } from '@/components/ui/logo';
import { ROUTES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" className="py-20">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <SparkyAvatar className="mx-auto size-24" />
            <h1 className="section-title mt-6 font-heading font-bold">
              Sparky could not find that page
            </h1>
            <p className="body-large mt-3 text-ink-soft">
              The link may be old, or the page may not be built yet. Let us get you back on track.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href={ROUTES.home} size="lg">
                Go home
              </ButtonLink>
              <ButtonLink href={ROUTES.dashboard} variant="secondary" size="lg">
                My dashboard
              </ButtonLink>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
