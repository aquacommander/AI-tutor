import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ui/coming-soon';

export const metadata: Metadata = {
  title: 'Creative Studio',
  description: 'Make stories, art prompts, and music blueprints with AI in the Creative Studio.',
};

export default function CreativeStudioPage() {
  return (
    <ComingSoon
      title="Creative Studio"
      description="Three AI-powered tools for making things: stories, art prompts, and music blueprints."
      milestone="Milestone 2"
      highlights={[
        'Story Weaver — pick a hero, setting, challenge, and mood, then watch a story appear',
        'Art Prompter — turn an idea into a detailed art prompt you can copy',
        'Music Maker — choose a mood and get a music blueprint to build from',
        'Art prompts produce text descriptions; image generation is out of scope for v1.0',
      ]}
    />
  );
}
