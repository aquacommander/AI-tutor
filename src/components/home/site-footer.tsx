import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Logo } from '@/components/ui/logo';
import { CONTACT, SOCIAL, ROUTES, SITE } from '@/lib/constants';
import { imgSrc } from '@/lib/images';

const FOOTER_SECTIONS = [
  {
    title: 'Learn',
    links: [
      { label: 'Sparky AI Tutor', href: ROUTES.tutor },
      { label: 'Code Lab', href: ROUTES.code },
      { label: 'Creative Studio', href: ROUTES.create },
      { label: 'Courses', href: ROUTES.courses },
      { label: 'Story Shelf', href: ROUTES.stories },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Explorer (6-8)', href: `${ROUTES.ageSelect}?group=explorer` },
      { label: 'Builder (9-12)', href: `${ROUTES.ageSelect}?group=builder` },
      { label: 'Creator (13-16)', href: `${ROUTES.ageSelect}?group=creator` },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'For Parents', href: ROUTES.parents },
      { label: 'About Us', href: ROUTES.about },
      { label: 'Pricing', href: ROUTES.pricing },
      { label: 'Privacy', href: ROUTES.privacy },
      { label: 'Terms', href: ROUTES.terms },
    ],
  },
];

export function SiteFooter() {
  return (
    /*
     * One section. The cloud artwork is the footer's background and everything
     * else is layered over it — `isolate` keeps the three background layers
     * from escaping into the rest of the page's stacking order.
     */
    <footer className="relative isolate overflow-hidden border-t border-border-soft">
      {/* Sky, which shows through the artwork's transparency. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-gradient-to-b from-background from-0% via-sky-light via-45% to-sky to-85%"
      />

      {/*
        The artwork. `contain`/`bottom` rather than `cover`: this is a wide,
        short banner, and covering a tall narrow footer would zoom it until only
        Sparky's middle survives at phone widths.

        `imgSrc` rather than the `img()` spread — a `fill` image must not be
        given a width, and that combination only errors in development.
      */}
      <Image
        src={imgSrc('footer/banner.webp')}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="-z-20 object-contain object-bottom"
      />

      {/*
        Readability veil.

        It is sized by the content block rather than by a fraction of the
        footer, which is the only version that holds: the columns stack on a
        phone, so the text can end anywhere between 60% and 85% of the footer's
        height. A gradient keyed to the footer either leaves the last lines
        exposed on desktop or veils Sparky on mobile. Tied to the content box,
        every line is covered at every width and the artwork below stays
        untouched.

        95% is not arbitrary — at 92% the muted legal text lands on 4.49:1
        against the darkest pixel in the artwork. Measured, not estimated.
      */}
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-background/95" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-full -z-10 h-28 bg-gradient-to-b from-background/95 to-transparent"
        />

        <Container className="pb-8 pt-12">
          <div className="grid gap-10 md:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
            <div>
              {/* The footer has the vertical room the two-line lockup needs. */}
              <Logo variant="lockup" />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
                A playful, safe place for children aged 6-16 to explore AI, coding, and creativity.
              </p>
            </div>

            {FOOTER_SECTIONS.map((section) => (
              <nav key={section.title} aria-label={section.title}>
                <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
                  {section.title}
                </h2>
                <ul className="mt-4 space-y-1">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-[44px] items-center text-sm text-ink-soft transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/*
            `ink-soft` rather than `ink-muted`: these are the lowest lines on the
            page and sit closest to the artwork, so they take the extra headroom.
          */}
          <div className="mt-10 border-t border-border-soft pt-6 text-sm text-ink-soft">
            <p>
              © {new Date().getFullYear()} {SITE.name}. Built for curious young minds.
            </p>
            <p className="mt-1">
              Guest mode keeps learning progress on this device only. No advertising or behavioural
              tracking scripts are used.
            </p>

            {/* Contact and social render only when configured, so the footer
                never links to an account that has not been created yet. */}
            {CONTACT.email || SOCIAL.length > 0 ? (
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                {CONTACT.email ? (
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    {CONTACT.email}
                  </a>
                ) : null}
                {SOCIAL.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    {social.label}
                  </a>
                ))}
              </p>
            ) : null}
          </div>
        </Container>
      </div>

      {/* Clear space below the veil so the artwork reads at full strength. */}
      <div aria-hidden="true" className="h-44 sm:h-52 lg:h-60" />
    </footer>
  );
}
