import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { safetyPoints } from '@/data/homepage-features';
import { img } from '@/lib/images';

export function SafetyBanner() {
  return (
    <section aria-labelledby="safety-heading" className="pb-16 md:pb-20 lg:pb-24">
      <Container>
        <div className="overflow-hidden rounded-large border border-grass/30 bg-grass-surface shadow-card">
          <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
            <div>
              <div className="flex items-center gap-3">
                <Image
                  {...img('safety/shield.webp')}
                  alt=""
                  aria-hidden="true"
                  sizes="72px"
                  className="h-14 w-auto shrink-0 object-contain"
                />
                <h2 id="safety-heading" className="section-title font-heading font-bold text-grass-dark">
                  A Safe and Trusted Space for Kids
                </h2>
              </div>

              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {safetyPoints.map((point) => {
                  const Icon = point.icon;
                  return (
                    <li key={point.id} className="flex gap-3">
                      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-grass-dark shadow-sm">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block font-heading font-bold text-ink">{point.title}</span>
                        <span className="block text-sm text-ink-soft">{point.description}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <Image
              {...img('safety/family.webp')}
              alt=""
              aria-hidden="true"
              loading="lazy"
              sizes="(max-width: 1024px) 90vw, 380px"
              className="mx-auto h-auto w-full max-w-sm lg:w-[380px]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
