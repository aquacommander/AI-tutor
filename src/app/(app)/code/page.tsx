import type { Metadata } from 'next';
import { CodeLab } from '@/components/code/code-lab';

export const metadata: Metadata = {
  title: 'Code Lab',
  description: 'Write Python, solve guided challenges, and earn XP in the in-browser Code Lab.',
};

export default function CodeLabPage() {
  return <CodeLab />;
}
