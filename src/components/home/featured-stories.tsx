import { ArrowRight } from 'lucide-react';
import { StoryCard } from '@/components/stories/story-card';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { stories } from '@/data/stories';
import { ROUTES } from '@/lib/constants';

export function FeaturedStories() {
  const featured = stories.slice(0, 3);

  return (
    <section aria-labelledby="stories-heading" className="pb-16 md:pb-20 lg:pb-24">
      <Container>
        <SectionHeading
          id="stories-heading"
          title="Once Upon an Algorithm"
          subtitle="Fairy tales with a real AI idea hidden inside. Read one tonight — the lesson comes free."
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {featured.map((story, index) => (
            <StoryCard key={story.slug} story={story} index={index} />
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <ButtonLink href={ROUTES.stories} variant="secondary" size="md">
            Open the story shelf
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
