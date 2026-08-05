import type { Metadata } from 'next';
import { AboutContent } from '@/components/about/about-content';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Four courses and 14 missions that teach children how AI really works — by playing with it.',
};

export default function AboutPage() {
  return <AboutContent />;
}
