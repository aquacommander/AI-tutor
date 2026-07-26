import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';
import { SiteFooter } from '@/components/home/site-footer';
import { SiteHeader } from '@/components/home/site-header';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Accounts arrive in v1.1. Start learning right now as a guest — no sign-up needed.',
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" className="py-12 md:py-16">
        <Container>
          <LoginForm />
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
