import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ui/coming-soon';

export const metadata: Metadata = {
  title: 'Sparky AI Tutor',
  description: 'Chat with Sparky, a friendly AI tutor for AI, coding, and creative STEM questions.',
};

export default function TutorPage() {
  return (
    <ComingSoon
      title="Sparky AI Tutor"
      description="Sparky is a friendly robot tutor who answers questions about AI, coding, maths, science, and creative projects — in language that matches your age group."
      milestone="Milestone 2"
      highlights={[
        'Streaming chat powered by Claude, with a typing indicator',
        'Age-aware system prompt so answers match Explorer, Builder, or Creator',
        'Server-side content filter plus a system-prompt guardrail on every message',
        'Suggested prompt chips and a clear-conversation button',
      ]}
    />
  );
}
