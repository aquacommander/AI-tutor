import { Construction } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { ROUTES } from '@/lib/constants';

interface ComingSoonProps {
  title: string;
  description: string;
  /** Which delivery milestone this page arrives in — keeps expectations honest. */
  milestone: string;
  highlights: string[];
}

export function ComingSoon({ title, description, milestone, highlights }: ComingSoonProps) {
  return (
    <Container>
      <Card className="mx-auto max-w-2xl">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-surface text-primary">
          <Construction className="size-6" aria-hidden="true" />
        </span>

        <h1 className="section-title mt-5 font-heading font-bold">{title}</h1>
        <p className="body-large mt-3 text-ink-soft">{description}</p>

        <p className="mt-6 inline-flex rounded-button bg-sunshine-light px-3 py-1 text-sm font-bold text-sunshine-dark">
          Arriving in {milestone}
        </p>

        <h2 className="mt-6 font-heading font-bold">What this page will include</h2>
        <ul className="mt-3 space-y-2">
          {highlights.map((item) => (
            <li key={item} className="flex gap-2 text-ink-soft">
              <span aria-hidden="true" className="text-primary">
                •
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={ROUTES.dashboard} size="md">
            Back to dashboard
          </ButtonLink>
          <ButtonLink href={ROUTES.home} variant="secondary" size="md">
            Home
          </ButtonLink>
        </div>
      </Card>
    </Container>
  );
}
