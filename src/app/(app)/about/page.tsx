import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ui/coming-soon';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Why AI for Kids exists and who it is built for.',
};

export default function AboutPage() {
  return (
    <ComingSoon
      title="About AI for Kids"
      description="Our aim is to make AI literacy fun, safe, and reachable for every child — whatever their technical background."
      milestone="Milestone 3"
      highlights={[
        'The thinking behind the three age tiers',
        'How lessons are written and reviewed',
        'An introduction video for new learners and their families',
        'How to get in touch with questions or feedback',
      ]}
    />
  );
}
