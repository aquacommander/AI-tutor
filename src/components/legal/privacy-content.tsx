import Link from 'next/link';
import { AlertTriangle, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { ROUTES, SITE } from '@/lib/constants';

/**
 * The privacy notice.
 *
 * Written to describe what the code actually does, clause by clause: no
 * accounts, no server-side child data, localStorage only, no analytics, no ad
 * SDKs, and one server call — to Anthropic — that carries the message and
 * nothing identifying.
 *
 * It is a **draft**, and says so at the top. A children's product touching
 * COPPA, UK GDPR and the Age Appropriate Design Code needs a lawyer's eyes
 * before launch; what this removes is the worse situation of shipping a
 * placeholder that says nothing at all.
 */
export function PrivacyContent() {
  return (
    <Container className="max-w-3xl space-y-8">
      <header>
        <h1 className="section-title font-heading font-bold">Privacy notice</h1>
        <p className="body-large mt-2 text-ink-soft">
          Written in plain language, because the people it affects are children and their families.
        </p>
      </header>

      {/* Not hidden in a footnote: this needs legal review before launch. */}
      <Card role="note" className="border-sunshine bg-sunshine-light">
        <p className="flex items-start gap-2 leading-relaxed">
          <AlertTriangle className="mt-1 size-5 shrink-0 text-sunshine-dark" aria-hidden="true" />
          <span>
            <strong>Draft, pending legal review.</strong> This describes exactly what the software
            does today. It has not yet been checked by a solicitor against COPPA, UK GDPR or the Age
            Appropriate Design Code, and it must be before {SITE.name} is offered to families.
          </span>
        </p>
      </Card>

      <Section title="The short version">
        <p>
          There is no account and no sign-up. We do not ask for a name, an email address, a
          birthday, a school or a photograph. Everything your child does is stored in their own
          browser and never sent to us, because there is no &ldquo;us&rdquo; to send it to — no
          server holds any record of any child.
        </p>
      </Section>

      <Section title="What is stored, and where">
        <p>
          One entry in your browser&rsquo;s local storage, under{' '}
          <code className="rounded bg-primary-surface px-1.5 py-0.5 text-sm">
            ai-for-kids:learner:v1
          </code>
          . It holds the age group chosen, experience points, badges, which missions are finished,
          and the answers given in activities.
        </p>
        <p>
          It stays on that device. Clearing your browser data removes it, and so does the{' '}
          <Link href={ROUTES.parents} className="font-bold text-primary hover:text-primary-dark">
            erase button on the parents page
          </Link>
          .
        </p>
      </Section>

      <Section title="The one thing that leaves the device">
        <p>
          Sparky, the AI tutor, and the Creative Studio send what a child types to Anthropic&rsquo;s
          Claude API to produce a reply. That message is the only thing transmitted. It is not stored
          by us, not linked to any profile, and carries no name or identifier — because we hold
          none.
        </p>
        <p>
          Every message is checked before it is sent, and every reply is checked before it is shown.
          Sparky is instructed never to ask for personal information and to tell a child to keep it
          private if they offer it.
        </p>
        <p>
          A short-lived count of requests per internet connection exists to stop the service being
          overwhelmed. It is held in memory, never written to disk, and disappears within the minute.
        </p>
      </Section>

      <Section title="What we do not do">
        <ul className="space-y-2">
          {[
            'No advertising, and no advertising SDKs.',
            'No analytics, no tracking pixels, no third-party scripts.',
            'No cookies used for tracking.',
            'No selling or sharing of anything, because there is nothing to sell.',
            'No embedded video from a service that profiles viewers.',
          ].map((line) => (
            <li key={line} className="flex gap-2">
              <X className="mt-1 size-4 shrink-0 text-coral-dark" aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Your rights">
        <ul className="space-y-2">
          {[
            'See everything stored: it is in your browser, and the parents page shows it.',
            'Erase everything, instantly, from the parents page.',
            'Use the site without storing anything at all — private browsing works fine.',
          ].map((line) => (
            <li key={line} className="flex gap-2">
              <Check className="mt-1 size-4 shrink-0 text-grass-dark" aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
        <p>
          There is no request to make and nobody to email, because we hold nothing. That is the
          point of the design.
        </p>
      </Section>

      <Section title="If this changes">
        <p>
          A future version may add optional accounts so progress follows a child between devices.
          That would mean holding data, and this notice would be rewritten and re-reviewed before it
          happened — not afterwards.
        </p>
      </Section>

      <p className="text-sm text-ink-muted">
        Questions about this notice should go to whoever operates this installation of {SITE.name}.
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
