import type { Metadata } from 'next';
import { PricingContent } from '@/components/pricing/pricing-content';

export const metadata: Metadata = {
  title: 'Courses and Pricing',
  description:
    'Four AI courses for children aged 9-12. $25 per course, or all four with 30% off. First mission free.',
};

export default function PricingPage() {
  return <PricingContent />;
}
