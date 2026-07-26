import { SiteFooter } from '@/components/home/site-footer';
import { SiteHeader } from '@/components/home/site-header';

/**
 * Shared chrome for the signed-in-style routes (dashboard, tutor, code, create,
 * courses). The route group keeps the URLs flat — `/dashboard`, not `/app/dashboard`.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="py-8 md:py-12">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
