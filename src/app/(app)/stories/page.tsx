import type { Metadata } from 'next';
import Image from 'next/image';
import { StoryCard } from '@/components/stories/story-card';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { stories } from '@/data/stories';
import { img } from '@/lib/images';

export const metadata: Metadata = {
  title: 'Story Shelf',
  description:
    'Fairy tales for children with a real idea about artificial intelligence hidden inside each one.',
};

export default function StoriesPage() {
  return (
    <>
      <Container>
        <div className="relative overflow-hidden rounded-large bg-gradient-to-br from-primary-surface via-parchment to-sunshine-light px-6 py-12 shadow-card md:px-12 md:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_auto]">
            <div>
              <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-primary">
                The Story Shelf
              </p>
              <h1 className="section-title mt-3 font-heading font-bold">
                Once upon an algorithm
                <span aria-hidden="true"> 🪄</span>
              </h1>
              <p className="body-large mt-4 max-w-xl text-ink-soft">
                Every tale here is a proper fairy tale — enchanted forests, clockwork birds,
                guardians made of stone. And inside every one of them, quietly, is a true idea about
                how artificial intelligence really works.
              </p>
              <p className="mt-4 max-w-xl text-ink-soft">
                Read them for the story. The lesson comes free at the end, and Sparky is waiting to
                talk about it.
              </p>
            </div>

            <Image
              {...img('hero/sparky.webp')}
              alt=""
              aria-hidden="true"
              priority
              sizes="(max-width: 1024px) 150px, 200px"
              className="mx-auto h-auto w-36 lg:w-52"
            />
          </div>
        </div>
      </Container>

      <Container className="mt-12">
        <Reveal>
          <h2 className="sr-only">All stories</h2>
        </Reveal>
        <ul className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {stories.map((story, index) => (
            <StoryCard key={story.slug} story={story} index={index % 3} />
          ))}
        </ul>

        <Reveal>
          <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-ink-muted">
            These tales are original drafts written for this platform. Like all learning content
            here, they are for review by the client or a qualified educator before public release.
          </p>
        </Reveal>
      </Container>
    </>
  );
}
