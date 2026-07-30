import type { Metadata } from 'next';
import { TutorChat } from '@/components/tutor/tutor-chat';

export const metadata: Metadata = {
  title: 'Sparky AI Tutor',
  description: 'Chat with Sparky, a friendly AI tutor for AI, coding, and creative STEM questions.',
};

export default function TutorPage() {
  return <TutorChat />;
}
