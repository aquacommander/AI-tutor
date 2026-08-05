import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { BUNDLE_DISCOUNT, PRICE_PER_COURSE, formatPrice } from '@/lib/commerce';
import { ROUTES, SITE } from '@/lib/constants';

/**
 * Terms of sale.
 *
 * Required the moment money changes hands: a buyer needs to know what they are
 * getting, for how long, and how to get their money back. Written to match the
 * product as built — including the parts that are honest about placeholders.
 *
 * Like the privacy notice, this is a **draft**. Selling to consumers, and
 * particularly to families with children, carries obligations that vary by
 * country. It needs a solicitor before the first sale, not after.
 */
export function TermsContent() {
  return (
    <Container className="max-w-3xl space-y-8">
      <header>
        <h1 className="section-title font-heading font-bold">Terms and refunds</h1>
        <p className="body-large mt-2 text-ink-soft">
          What you are buying, and what happens if it is not right for your child.
        </p>
      </header>

      <Card role="note" className="border-sunshine bg-sunshine-light">
        <p className="flex items-start gap-2 leading-relaxed">
          <AlertTriangle className="mt-1 size-5 shrink-0 text-sunshine-dark" aria-hidden="true" />
          <span>
            <strong>Draft, pending legal review.</strong> Consumer sales — especially to families
            with children — carry obligations that differ by country. These terms must be checked by
            a solicitor before the first sale.
          </span>
        </p>
      </Card>

      <Section title="What you are buying">
        <p>
          Access to online course material: animated mission films, interactive activities, quizzes,
          final projects and printable worksheets. It is a digital product. Nothing is posted to you.
        </p>
        <p>
          A single course is {formatPrice(PRICE_PER_COURSE)}. All four together are{' '}
          {Math.round(BUNDLE_DISCOUNT * 100)}% less. Prices are in US dollars and exclude any local
          tax that may apply.
        </p>
      </Section>

      <Section title="Try before you buy">
        <p>
          The first mission is free and complete — the film, the activity, the challenge and the
          quiz. We would rather you decided after using the real thing than after reading this page.
        </p>
      </Section>

      <Section title="Refunds">
        <p>
          If the course is not right for your child, ask for a refund within{' '}
          <strong>30 days</strong> and you will get one. No form, no reason required.
        </p>
        <p>
          Statutory rights come on top of this and are not affected by it. In the UK and EU that
          includes a 14-day right to cancel, which for digital content you have chosen to access
          immediately may be waived at the point of purchase — the checkout will say so clearly.
        </p>
      </Section>

      <Section title="How long you have access">
        <p>
          Indefinitely. There is no subscription and nothing renews. If the material is updated —
          better artwork, subtitles, a new activity — you get the update without paying again.
        </p>
      </Section>

      <Section title="What is still being finished">
        <p>
          Being straight about it, because you are paying: the films do not currently have
          subtitles, and some illustrations inside the activities are placeholders while the artwork
          is produced. The teaching content is complete and the courses work end to end. If either
          of those matters to you, the free mission shows exactly what you would be buying.
        </p>
      </Section>

      <Section title="Using it">
        <p>
          Buy it for your own family and use it as much as you like. Schools, clubs and tutors
          running it with a group need group access — get in touch rather than sharing a personal
          purchase.
        </p>
        <p>
          Please do not re-publish, resell or upload the films or worksheets elsewhere. They took a
          long time to make.
        </p>
      </Section>

      <Section title="Your data">
        <p>
          Covered separately and briefly, because there is very little of it. See the{' '}
          <Link href={ROUTES.privacy} className="font-bold text-primary hover:text-primary-dark">
            privacy notice
          </Link>
          .
        </p>
      </Section>

      <p className="text-sm text-ink-muted">
        Questions about these terms should go to whoever operates this installation of {SITE.name}.
      </p>
    </Container>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="card-title font-heading">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}
