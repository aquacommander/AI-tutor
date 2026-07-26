# AI for Kids

A playful, safe web platform where children aged 6-16 learn AI, coding, and creativity.

Built with Next.js 14 (App Router), TypeScript in strict mode, and Tailwind CSS.

---

## Status: Milestone 1 complete

| Milestone | Days | Scope | State |
| --- | --- | --- | --- |
| 1 | 1-5 | Repo, design system, landing page, age selection, dashboard, responsive foundation | **Done** |
| 2 | 6-10 | Sparky AI Tutor, Claude integration, safety controls, Code Lab, Creative Studio | Not started |
| 3 | 11-15 | Course library, lessons, quizzes, XP and badges, testing, Vercel deploy | Not started |

Routes for Milestone 2 and 3 features already exist and render an honest
"arriving in Milestone N" page listing what each will contain, so no navigation
link is ever a dead end.

---

## Getting started

```bash
npm install
cp .env.example .env.local     # ANTHROPIC_API_KEY is only needed from Milestone 2
npm run dev                    # http://localhost:3000
```

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build:assets` | Rebuild every web asset from `assets/source/` |
| `npm run check:images` | next/image `fill`/`width` guard (also runs inside `lint`) |

> **Building while `npm run dev` is running?** Both write to `.next` by default,
> so a production build will clobber the dev server's artifacts and the running
> app starts returning 500 for its own CSS. Give the build its own directory:
>
> ```bash
> NEXT_DIST_DIR=.next-verify npm run build
> NEXT_DIST_DIR=.next-verify npx next start -p 3111
> ```

---

## Artwork pipeline

The supplied artwork is 30 PNGs at 1536x1024 with transparent backgrounds,
~2.4 MB each (69 MB total). They live in **`assets/source/`**, deliberately
outside `public/` — anything under `public/` is served verbatim, so leaving
them there would deploy all 69 MB.

`npm run build:assets` turns them into the web set:

```
assets/source/<n>.png  ──trim──resize──WebP──▶  public/images/<slot>.webp
                                          └──▶  src/data/image-manifest.json
                                          └──▶  src/app/{icon,apple-icon,opengraph-image}.png
```

- **Trim** removes the wide transparent margin so each asset's intrinsic box is
  the artwork itself, which makes layout sizing predictable.
- **Resize** targets roughly 2x the largest size the layout displays it at.
- **WebP** preserves alpha at a fraction of the size: **69 MB → 2.0 MB**.

`scripts/build-assets.mjs` is also the asset manifest — it records which source
number feeds which slot, at what size, and why.

### Never hard-code image dimensions

Components read them from the generated manifest:

```tsx
import { img } from '@/lib/images';

<Image {...img('hero/sparky.webp')} alt="" sizes="280px" />
```

`img()` returns `src`, `width`, and `height` straight from the built files, and
`ImageKey` is a union of every generated path, so a typo is a type error. This
is what keeps CLS at zero when artwork is re-exported at a different size.

### Replacing or adding artwork

Drop a new file into `assets/source/`, point the matching `ASSETS` entry in
`scripts/build-assets.mjs` at it, and run `npm run build:assets`. Components and
data files need no changes. A source is either a number (`12` -> `12.png`) or an
explicit filename, so artwork arriving outside the numbered set just works.

> **Do not put source artwork in `public/images/`.** That directory is
> generated — the build starts by deleting it, so anything dropped there is
> lost on the next `npm run build:assets`, and an unoptimised source would be
> deployed verbatim in the meantime.

Artwork with transparency needs a backdrop that suits it. The footer banner is
white cloud on transparency: on the cream page background it is invisible, so it
sits on a sky gradient that also bookends the sky the hero opens with. The sky
has to be fully established *above* where the clouds begin, or the white cloud
sits on cream and washes out.

### Text over artwork: the footer veil

The footer is one section — sky, then the cloud artwork, then a readability
veil, then the content, layered in a single `isolate` stacking context.

The veil is **sized by the content block, not by a fraction of the footer.**
That is the only version that holds: the columns stack on a phone, so the last
line of text can land anywhere between roughly 60% and 85% of the footer's
height. A gradient keyed to the footer either leaves the legal lines exposed on
desktop or veils Sparky on mobile — the first attempt measured **2.75:1** at
1440px for exactly that reason.

Its opacity is measured, not guessed. At 92% the muted legal text lands on
4.49:1 against the darkest pixel in the artwork, so it is 95%, and the legal
lines use `ink-soft` rather than `ink-muted` for headroom.

**Verify by sampling pixels, not by eye.** The check screenshots the footer with
all text hidden, then for each text run finds the worst-behind-it pixel in that
screenshot and contrasts it against the run's own computed colour. Re-run it
after any change to the footer artwork, veil, or palette.

### Some Next.js errors only happen in development

`next/image` throws if given both `fill` and a `width` — but that check sits
behind `process.env.NODE_ENV !== 'production'`. A production build accepts the
same markup silently.

This bit: `<Image fill {...img(...)} />` rendered correctly under `next build` /
`next start` and passed every check run against them, while returning **500 on
every page** under `next dev`. TypeScript does not catch it either — Next's
`ImageProps` union is defeated by a spread.

Two things guard it now:

- **`imgSrc()`** returns only the path, for `fill` images. Never spread `img()`
  onto a `fill` image.
- **`npm run check:images`** scans every `<Image>` for the combination and fails
  the build. It runs as part of `npm run lint` and needs no browser. It carries
  its own `--self-test`, which plants the mistake in **temp fixtures** and
  asserts the check still catches it — that self-test immediately found a false
  positive on a `/* … */` comment inside a tag.

More generally: **verifying only against `next start` has a blind spot.** When
touching anything Next validates at render time, smoke-test a `next dev` server
too. Give it its own output directory so it does not fight the main one:

```bash
NEXT_DIST_DIR=.next-dev-verify npx next dev -p 3210
```

**Never prove a check works by editing files under `src/`.** A dev server
watching them compiles the broken state, and Fast Refresh can keep serving that
stale module even after the file is restored — the source reads correctly while
every route still 500s. Touching the file forces a recompile and clears it, but
the better answer is to test against fixtures in a temp directory, which is what
`--self-test` does.

### Careful with arbitrary Tailwind values

Tailwind scans source files for whole class names as **literal text**. A class
assembled by concatenating strings is never seen, and generates no CSS at all —
silently, with no build error:

```tsx
// Broken: the scanner never sees the whole token.
className={'bg-[linear-gradient(to_bottom,' + 'theme(colors.sky.DEFAULT)_40%)]'}
```

Keep an arbitrary value on one line, or use ordinary utilities with stop
positions (`from-background from-0% via-sky-light via-12% to-sky to-40%`), which
is what the footer band does.

### What is *not* generated artwork

- **Functional icons** (nav, buttons, safety list, difficulty badges) use
  Lucide React, as the spec's stack requires. The supplied set has no
  equivalent glyphs, and illustrations do not read at 16-20px.
- **Ambient sky** (clouds, twinkling stars) is CSS and inline SVG in
  `src/components/home/sky-decoration.tsx` — it scales to any viewport at no
  network cost.
- **Badge icons** in the dashboard collection are emoji: there are eight badges
  and only five reward illustrations, and a mix of the two looks unfinished.

### Known artwork gaps

| Slot | Current state |
| --- | --- |
| Course thumbnails (4) | Reuse the closest thematic illustration — no dedicated course artwork was supplied |
| Hero castle | Left out: the children occupy the right edge, so it only rendered as a fragment behind them. Shown at full size in the closing CTA |
| Badge collection (8) | Emoji, per above |

---

## Architecture

```
assets/source/                30 supplied PNGs — never served, only built from
public/images/                generated WebP (2.0 MB)
scripts/build-assets.mjs      asset manifest + build pipeline
src/
├── app/
│   ├── layout.tsx            Root layout: fonts, metadata, skip link
│   ├── page.tsx              Landing page
│   ├── globals.css           Design tokens + base layer
│   ├── icon.png              Favicon          ) all three generated by
│   ├── apple-icon.png        iOS icon         ) npm run build:assets
│   ├── opengraph-image.png   Social card      )
│   ├── age-select/           Age group selection
│   ├── login/                Scaffolded sign-in (no backend until v1.1)
│   └── (app)/                Route group sharing the app chrome
│       ├── layout.tsx        Header + main + footer
│       ├── dashboard/
│       ├── tutor/ code/ create/
│       └── courses/[courseId]/
├── components/
│   ├── home/                 One component per homepage section
│   ├── dashboard/
│   ├── age-select/
│   ├── auth/
│   └── ui/                   Button, Card, Badge, ProgressBar, Container, ...
├── data/                     Static content + image-manifest.json (generated)
├── hooks/                    useLearnerProgress, useAgeGroup
├── lib/                      constants, storage, fonts, images, utils
└── types/                    learner, course, homepage
```

The `(app)` route group keeps URLs flat (`/dashboard`, not `/app/dashboard`)
while letting the dashboard and feature pages share one header/footer layout.

### Design tokens

The background is a warm cream (`#fff8f0`) with three soft fixed radial washes
over it, so the page reads as lamplight rather than screen glare. Card shadows
are tinted warm brown, not blue-grey.

Every foreground token was re-checked against that background when it changed —
`ink-muted`, `grass-dark`, `coral-dark`, and `sunshine-dark` all had to be
darkened to hold 4.5:1. **If you change the background, re-check them all.**

### Header and the hero

The header floats *over* the hero rather than sitting above it. It stays in
normal flow (so `position: sticky` keeps working down the whole page), and the
hero pulls itself up underneath it with `.hero-bleed`, which offsets by
`--header-offset` and pads the same amount back. That variable is the header's
gutter plus its own height — **if the header's padding or control heights
change, update it**, or a band of page background reappears above the sky.

The palette lives in **two synchronised places**:

- `tailwind.config.ts` — the source of truth for Tailwind utilities.
- `src/app/globals.css` — the same values as CSS custom properties, for raw CSS
  (gradients, shadows, keyframes).

Change both together.

Colour tokens ending in `-dark` exist so text and meaningful icons can sit on
the matching `-light` surface at 4.5:1 or better. Never pair a base tint with
white text.

---

## The Story Shelf

`/stories` holds six original fairy tales. Each is a real fairy tale — enchanted
forests, clockwork birds, guardians made of stone — and each carries one true
idea about AI inside it.

| Tale | Idea it carries |
| --- | --- |
| The Lantern That Learned the Way | Learning from examples (training data) |
| The Mirror That Only Knew Roses | Bias in data |
| The Baker Who Sorted the Starfruit | Classification and features |
| Wren and the Whispering Wood | Understanding language and intent |
| The Clockwork Nightingale | Generative AI, patterns, and credit |
| The Two Guardians of the Amber Bridge | AI ethics and human judgement |

**The rule when writing a new one:** the magic must *be* the concept, not a
costume worn over a lecture. A lantern that remembers the paths it has walked
*is* training data. A child should enjoy the story and never notice they were
taught something. The explanation goes after the tale ends, in "The lesson
hidden in the tale" — never inside it.

Tales live in `src/data/stories.ts` as typed blocks (`prose`, `scene`, `verse`,
`whisper`), so a new story is a data entry, not new components. Story text
supports `**bold**` and `*italic*` through `RichText`, which parses to real
elements rather than injecting HTML.

These are draft content. Per the project plan, educational material needs
client or educator sign-off before public release — the shelf page says so.

---

## Motion and scroll feel

The site should feel fluid in both directions without hijacking the scrollbar.
No smooth-scroll library is used: they fight the browser's native scrolling and
break accessibility. Instead:

| Effect | How | Cost during scroll |
| --- | --- | --- |
| Sections settle in as you reach them | `Reveal` + IntersectionObserver, fires once | None — observer disconnects |
| Cards arrive as a wave | Staggered `transition-delay` | None |
| Sky layers drift against the scroll | CSS `animation-timeline: view()` | None — runs on the compositor |
| Reading progress on a tale | CSS `animation-timeline: scroll()` | None |
| Header lifts once the page moves | IntersectionObserver on a sentinel | None |
| Story cards wake on hover | Lift, tilt, glow, light sweep, sparkles | None |

The card hover is deliberately not a generic lift. The card tips very slightly
as if being picked up, a warm glow wakes underneath it, a band of light passes
across the artwork, sparkles bloom in sequence, and a gold rule draws itself
under the title. Every part animates `transform` or `opacity` only, and
`group-focus-within` mirrors `group-hover` throughout so a keyboard user gets
the same response.

It lives in `src/components/ui/enchanted-card.tsx` and is shared by **every**
card on the site: age groups, learning modules, featured lessons, stories, and
courses. To use it: put `group relative` on the card's wrapper, render
`<CardGlow />` as a sibling *before* the link, and put `<CardShimmer />` and
`<CardSparkles />` inside whichever `overflow-hidden` box holds the artwork.

`enchantedCardClass` carries no background and `enchantedArtClass` no sizing —
cards sit on white or on a tinted surface, and artwork is sometimes a full
thumbnail and sometimes a small icon, so the caller supplies both.

`<CardSparkles variant="compact" />` is for icon and character boxes: three
smaller sparkles, gold rather than white, because they sit on pale surfaces
where white would vanish.

Cards inside the lesson carousel pass `<CardGlow tight />` and the viewport
carries `py-6`: Embla needs `overflow-hidden` to clip horizontally, which would
otherwise crop the lift and glow.

Nothing listens to the `scroll` event, and only `opacity` and `transform` are
animated, so no frame touches layout or paint.

**Three states must all work**, and all three are covered by
`scripts`-adjacent checks described below:

1. **Normal** — content is hidden, then revealed as you scroll, and never
   re-hides on the way back up.
2. **`prefers-reduced-motion: reduce`** — everything is visible immediately and
   nothing animates. `.reveal` is reset explicitly; simply shortening its
   transition would leave off-screen content permanently invisible.
3. **JavaScript disabled** — a `<noscript>` style in the root layout forces
   every `.reveal` to its final state. Without it the observer never runs and
   the page is blank.

Any new reveal-style effect must keep all three working.

---

## Learner state (guest mode)

v1.0 has no accounts. Everything a learner earns lives in one versioned
localStorage record under `ai-for-kids:learner:v1`:

```ts
interface StoredLearnerState {
  version: 1;
  ageGroup: 'explorer' | 'builder' | 'creator';
  progress: LearnerProgress;
  completedLessons: string[];
  completedChallenges: string[];
  earnedBadges: string[];
  recentActivity: ActivityEntry[];
  lastActivityAt: string;
}
```

Read it with `useLearnerProgress()`. Notes for anyone extending it:

- The store is a `useSyncExternalStore` source, so every component stays in
  sync and changes propagate across browser tabs.
- `isLoaded` is false during SSR and the first client render. Guard personalised
  UI on it — the server cannot know who the learner is, and rendering a name too
  early causes a hydration mismatch.
- An unrecognised `version` is discarded rather than migrated, so a future shape
  change can never crash the app for a returning learner.
- Reads and writes are wrapped in `try/catch`: private browsing and blocked
  storage partitions degrade to "new guest" instead of throwing.

**Never render invented progress.** With no profile, the homepage panel shows
"Your Learning Journey" and zeroed stats, and the dashboard shows an empty
state — not a placeholder child's name or fabricated activity.

---

## Copy rules

Two claims from the design concept were deliberately left out, and must stay out
until someone can substantiate them:

| Concept copy | Shipped instead | Why |
| --- | --- | --- |
| "Trusted by 50,000+ kids and parents" | "Designed for young learners and their families" | No verified user count |
| "Join thousands of young explorers" | "Join young explorers learning, creating, and building with AI." | Same |

The safety banner likewise avoids absolute legal claims ("100% safe",
"COPPA certified"). Those require formal verification first — see PRD §8.

---

## Accessibility

Verified in this milestone, at 320 / 375 / 768 / 1024 / 1440px:

- No horizontal overflow on any page at any tested width.
- Every link and button is at least 44px high.
- One `<h1>` per page, no skipped heading levels, real landmarks.
- Skip link is the first tab stop and becomes visible on focus.
- 3px focus ring on every focusable element.
- Mobile drawer: `role="dialog"`, scroll lock, focus moves in, Tab is trapped,
  Escape closes and returns focus to the trigger.
- `prefers-reduced-motion: reduce` stops all animation.
- Difficulty and badge states carry a word and an icon, never colour alone.
- Decorative images use `alt=""`; meaningful ones are described.

---

## Notes for the next milestone

- `ANTHROPIC_API_KEY` is server-side only. Never expose it with `NEXT_PUBLIC_`.
- Sparky must be reached through `POST /api/ai-tutor`, never called from the
  browser. The homepage only advertises Sparky; it must not load the AI API.
- `framer-motion` was removed. Every animation in the design is achievable with
  CSS keyframes (see `tailwind.config.ts`), and those respect reduced motion for
  free. Reintroduce it only if a real need appears.
- The body font needs a hand-computed fallback; see the comment in
  `src/lib/fonts.ts` before changing it.
