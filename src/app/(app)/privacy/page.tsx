import type { Metadata } from 'next';
import { PrivacyContent } from '@/components/legal/privacy-content';

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'No accounts, no tracking, and nothing about a child stored on a server. Written in plain language.',
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
