import type { LucideIcon } from 'lucide-react';
import type { ImageKey } from '@/lib/images';
import type { AgeGroupId, ThemeName } from './learner';

export interface AgeGroupCardData {
  id: AgeGroupId;
  title: string;
  ageRange: string;
  description: string;
  /** Short focus list shown to parents; also read out as the card's a11y detail. */
  focus: string[];
  /** Small badge icon. No illustrated icon was supplied for these, so Lucide. */
  icon: LucideIcon;
  characterImage: ImageKey;
  theme: Extract<ThemeName, 'green' | 'purple' | 'coral'>;
  href: string;
}

export interface FeatureCardData {
  id: string;
  title: string;
  description: string;
  image: ImageKey;
  href: string;
  theme: Extract<ThemeName, 'blue' | 'green' | 'purple' | 'orange'>;
}

export interface SafetyPoint {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}
