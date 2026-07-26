import Image from 'next/image';
import { PlayCircle, Rocket } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { ROUTES } from '@/lib/constants';
import { img } from '@/lib/images';
import { SkyDecoration } from './sky-decoration';

export function FinalCallToAction() {
  return (
    <section aria-labelledby="cta-heading" className="pb-16 md:pb-20 lg:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-large bg-gradient-to-br from-primary via-primary-dark to-sky px-6 py-12 text-white shadow-card md:px-10">
          <SkyDecoration className="opacity-60" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
            <Image
              {...img('hero/sparky.webp')}
              alt=""
              aria-hidden="true"
              loading="lazy"
              sizes="(max-width: 1024px) 140px, 190px"
              className="mx-auto h-auto w-32 lg:w-48"
            />

            <div className="text-center">
              <h2 id="cta-heading" className="section-title font-heading font-bold text-white">
                Ready to Start Your AI Adventure?
              </h2>
              {/*
                The concept read "Join thousands of young explorers". There is no
                user count to stand behind yet, so the claim is left out.
              */}
              <p className="body-large mx-auto mt-3 max-w-lg text-white/90">
                Join young explorers learning, creating, and building with AI.
              </p>

              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <ButtonLink href={ROUTES.ageSelect} variant="sunshine" size="lg">
                  Start Learning Now
                  <Rocket className="size-5" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href={ROUTES.about} variant="outline" size="lg">
                  <PlayCircle className="size-5" aria-hidden="true" />
                  Watch Introduction
                </ButtonLink>
              </div>
            </div>

            {/* Non-essential scenery: dropped below lg so the copy keeps the width. */}
            <Image
              {...img('hero/castle.webp')}
              alt=""
              aria-hidden="true"
              loading="lazy"
              sizes="200px"
              className="hidden h-auto w-48 lg:block"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
