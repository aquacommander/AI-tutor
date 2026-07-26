import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { learningFeatures } from '@/data/homepage-features';
import { FeatureCard } from './feature-card';

export function LearningFeatures() {
  return (
    <section aria-labelledby="features-heading" className="pb-16 md:pb-20 lg:pb-24">
      <Container>
        <SectionHeading
          id="features-heading"
          title="Learn, Create, and Explore"
          emoji="⭐"
          subtitle="Everything you need to become an AI explorer."
        />

        {/* Stacked on phones rather than a cramped four-card carousel. */}
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6">
          {learningFeatures.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
