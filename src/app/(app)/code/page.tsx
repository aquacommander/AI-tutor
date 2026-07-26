import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ui/coming-soon';

export const metadata: Metadata = {
  title: 'Code Lab',
  description: 'Write Python, solve guided challenges, and earn XP in the in-browser Code Lab.',
};

export default function CodeLabPage() {
  return (
    <ComingSoon
      title="Code Lab"
      description="A Python sandbox with guided challenges. Write code, check your answer, and earn XP as you go."
      milestone="Milestone 2"
      highlights={[
        'Five challenges: Hello World, Number Guessing, Prime Checker, Fibonacci, Calculator',
        'Starter code and a difficulty badge for each challenge',
        'Guided validation of your solution (real Python execution arrives in v1.2)',
        '"Get a Hint" button that asks Sparky for a nudge, not the answer',
      ]}
    />
  );
}
