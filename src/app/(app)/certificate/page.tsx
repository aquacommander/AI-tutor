import type { Metadata } from 'next';
import { CertificateView } from '@/components/certificate/certificate-view';

export const metadata: Metadata = {
  title: 'Certificate',
  description: 'Your AI for Kids certificate of completion, earned after all four final projects.',
};

export default function CertificatePage() {
  return <CertificateView />;
}
