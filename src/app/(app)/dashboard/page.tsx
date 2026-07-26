import type { Metadata } from 'next';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your XP, badges, streak, learning modules, and recent activity in one place.',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
