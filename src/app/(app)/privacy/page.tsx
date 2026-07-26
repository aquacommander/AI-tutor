import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ui/coming-soon';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What AI for Kids stores, what it does not, and where your data lives.',
};

export default function PrivacyPage() {
  return (
    <ComingSoon
      title="Privacy"
      description="In v1.0 there are no accounts and no server-side user records. Your age group and progress are stored in this browser only."
      milestone="Milestone 3"
      highlights={[
        'The full list of what is written to browser storage, and how to clear it',
        'What is sent to the AI provider when you chat with Sparky, and what is not',
        'Confirmation that no advertising SDKs or behavioural tracking scripts are loaded',
        'How parental consent will work once accounts arrive in v1.1',
      ]}
    />
  );
}
