import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ui/coming-soon';

export const metadata: Metadata = {
  title: 'For Parents',
  description: 'How AI for Kids handles safety, privacy, and age-appropriate content.',
};

export default function ForParentsPage() {
  return (
    <ComingSoon
      title="For Parents"
      description="A plain-language guide to how this platform handles your child's safety, privacy, and learning content."
      milestone="Milestone 3"
      highlights={[
        'How Sparky is restricted to AI, coding, maths, science, and creative topics',
        'What the content filter blocks, and what happens on an off-topic question',
        'What is stored on your device, and what is never sent to a server',
        'How age groups change reading level and challenge difficulty',
      ]}
    />
  );
}
