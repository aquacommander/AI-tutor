import Image from 'next/image';
import { Rocket } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { ROUTES } from '@/lib/constants';
import { img } from '@/lib/images';
import { SkyDecoration } from './sky-decoration';

export function HeroSection() {
  return (
    <section className="hero-bleed relative overflow-hidden bg-gradient-to-b from-sky via-sky-light to-background">
      <SkyDecoration />

      {/*
        `min-w-0` on both columns: a grid item defaults to min-width:auto, so the
        artwork would otherwise refuse to shrink and push the page into
        horizontal scroll between 1024px and 1240px.
      */}
      <Container className="relative grid items-center gap-10 pb-16 pt-14 lg:min-h-[600px] lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:pb-20 lg:pt-20">
        <div className="min-w-0 text-center lg:text-left">
          {/*
            Each line is its own block so the colour breaks land where the design
            puts them. `nowrap` only from lg up: below that the natural wrap is
            what keeps the headline inside a 320px viewport.
          */}
          <h1 className="hero-title font-heading font-bold text-ink">
            <span className="block lg:whitespace-nowrap">Learn AI</span>
            <span className="block lg:whitespace-nowrap">
              Through <span className="text-primary">Play</span>,
            </span>
            <span className="block lg:whitespace-nowrap">
              <span className="text-coral-dark">Creativity</span>, and
            </span>
            <span className="block lg:whitespace-nowrap">
              <span className="text-grass-dark">Discovery</span>
            </span>
          </h1>

          <p className="body-large mx-auto mt-6 max-w-md text-ink lg:mx-0">
            Fun, hands-on adventures that spark curiosity and build real AI skills for the future.
          </p>

          <div className="mt-8 flex justify-center lg:justify-start">
            <ButtonLink href={ROUTES.ageSelect} size="lg">
              Start Your Journey
              <Rocket className="size-5" aria-hidden="true" />
            </ButtonLink>
          </div>

          {/*
            The concept art carried a "Trusted by 50,000+" figure. It is not
            substantiated, so this states only what is verifiably true today.
          */}
          <p className="mt-6 text-sm font-semibold text-ink-soft">
            Designed for young learners and their families
          </p>
        </div>

        <HeroArtwork />
      </Container>
    </section>
  );
}

/**
 * The supplied artwork is a set of separate cut-outs rather than the single
 * composed scene in the concept render, so the scene is assembled here.
 *
 * The two learners carry the hero on their own — Sparky is deliberately absent.
 * He still greets the reader at the closing call to action and across the story
 * shelf, so the brand mascot is not lost, just held back from the opening frame.
 *
 * With only one subject the pair is centred and given most of the frame; sat
 * off to one side, as they were when Sparky stood beside them, they leave a
 * conspicuous gap. Percentages keep the composition intact at every width.
 */
function HeroArtwork() {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-xl lg:max-w-none">
      {/* Reserves the composition's aspect ratio so nothing shifts as it loads. */}
      <div className="relative aspect-[7/6] w-full">
        <Image
          {...img('hero/planet.webp')}
          alt=""
          aria-hidden="true"
          sizes="(max-width: 768px) 14vw, 120px"
          className="absolute left-[2%] top-0 w-[16%] animate-float-slow"
        />
        <Image
          {...img('hero/spaceship.webp')}
          alt=""
          aria-hidden="true"
          sizes="(max-width: 768px) 11vw, 100px"
          className="absolute right-[1%] top-[4%] w-[13%] animate-float"
        />
        {/*
          No castle here: the children fill the frame, so it only ever rendered
          as a fragment peeking out from behind them. It carries the same idea
          at full size in the closing call to action.
        */}
        <Image
          {...img('hero/sparkles.webp')}
          alt=""
          aria-hidden="true"
          sizes="80px"
          className="absolute bottom-[30%] left-0 w-[12%] animate-twinkle"
        />

        <Image
          {...img('hero/children-tablet.webp')}
          alt="Two children sitting together, exploring an AI lesson on a tablet"
          priority
          sizes="(max-width: 768px) 82vw, 620px"
          className="absolute bottom-0 left-1/2 w-[88%] -translate-x-1/2"
        />
      </div>
    </div>
  );
}
