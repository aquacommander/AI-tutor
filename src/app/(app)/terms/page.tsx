import type { Metadata } from 'next';
import { TermsContent } from '@/components/legal/terms-content';

export const metadata: Metadata = {
  title: 'Terms and Refunds',
  description: 'What you are buying, how long you have access, and our 30-day refund promise.',
};

export default function TermsPage() {
  return <TermsContent />;
}
