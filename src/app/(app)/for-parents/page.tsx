import type { Metadata } from 'next';
import { ParentsContent } from '@/components/parents/parents-content';

export const metadata: Metadata = {
  title: 'For Parents and Teachers',
  description:
    'What your child is learning, how long it takes, what we store, and how to erase it.',
};

export default function ForParentsPage() {
  return <ParentsContent />;
}
