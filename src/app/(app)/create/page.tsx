import type { Metadata } from 'next';
import { CreativeStudio } from '@/components/create/creative-studio';

export const metadata: Metadata = {
  title: 'Creative Studio',
  description: 'Make stories, art prompts, and music blueprints with AI in the Creative Studio.',
};

export default function CreativeStudioPage() {
  return <CreativeStudio />;
}
