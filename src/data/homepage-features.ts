import { EyeOff, Heart, ShieldCheck, Users } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import type { FeatureCardData, SafetyPoint } from '@/types/homepage';

export const learningFeatures: FeatureCardData[] = [
  {
    id: 'tutor',
    title: 'Sparky AI Tutor',
    description: 'Your friendly AI buddy who explains, guides, and cheers you on.',
    image: 'features/sparky-tutor.webp',
    href: ROUTES.tutor,
    theme: 'blue',
  },
  {
    id: 'code',
    title: 'Code Lab',
    description: 'Write code, solve challenges, and build awesome AI projects.',
    image: 'features/code-lab.webp',
    href: ROUTES.code,
    theme: 'green',
  },
  {
    id: 'create',
    title: 'Creative Studio',
    description: 'Create art, music, stories, and more with the power of AI.',
    image: 'features/creative-studio.webp',
    href: ROUTES.create,
    theme: 'purple',
  },
  {
    id: 'courses',
    title: 'AI Courses',
    description: 'Step-by-step courses designed for curious minds like yours.',
    image: 'features/courses.webp',
    href: ROUTES.courses,
    theme: 'orange',
  },
];

/**
 * Deliberately free of absolute legal claims ("100% safe", "COPPA certified").
 * Those may only be added once formally verified — see PRD section 8.
 *
 * These stay as Lucide glyphs: they are small supporting marks in a list, and
 * the supplied artwork has no matching set.
 */
export const safetyPoints: SafetyPoint[] = [
  {
    id: 'content',
    title: 'Kid-friendly content and guidance',
    description: 'Every lesson and AI reply is written for a young audience.',
    icon: Heart,
  },
  {
    id: 'privacy',
    title: 'Privacy-first learning experience',
    description: 'Guest mode by default. Progress stays on this device.',
    icon: ShieldCheck,
  },
  {
    id: 'age-appropriate',
    title: 'Age-appropriate activities',
    description: 'Reading level and challenge scale to the chosen age group.',
    icon: Users,
  },
  {
    id: 'built-with-care',
    title: 'Built with child safety in mind',
    description: 'No advertising SDKs and no behavioural tracking scripts.',
    icon: EyeOff,
  },
];
