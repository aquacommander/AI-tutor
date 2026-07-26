import { AgeGroupSection } from '@/components/home/age-group-section';
import { FeaturedLessons } from '@/components/home/featured-lessons';
import { FeaturedStories } from '@/components/home/featured-stories';
import { FinalCallToAction } from '@/components/home/final-cta';
import { HeroSection } from '@/components/home/hero-section';
import { LearningFeatures } from '@/components/home/learning-features';
import { ProgressPreview } from '@/components/home/progress-preview';
import { SafetyBanner } from '@/components/home/safety-banner';
import { SiteFooter } from '@/components/home/site-footer';
import { SiteHeader } from '@/components/home/site-header';
import { Reveal } from '@/components/ui/reveal';

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content">
        {/*
          The hero is not wrapped: it is the largest contentful paint, and
          starting it at opacity 0 would delay the metric for no visual gain.
          Everything below settles in as the reader arrives at it.
        */}
        <HeroSection />

        <Reveal>
          <AgeGroupSection />
        </Reveal>
        <Reveal>
          <LearningFeatures />
        </Reveal>
        <Reveal>
          <FeaturedStories />
        </Reveal>
        <Reveal>
          <ProgressPreview />
        </Reveal>
        <Reveal>
          <SafetyBanner />
        </Reveal>
        <Reveal>
          <FeaturedLessons />
        </Reveal>
        <Reveal>
          <FinalCallToAction />
        </Reveal>
      </main>

      <SiteFooter />
    </>
  );
}
