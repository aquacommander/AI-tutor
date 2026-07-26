import { Fredoka, Nunito_Sans } from 'next/font/google';

/**
 * Both faces load as variable fonts — one file covers every weight the design
 * uses, so there is no per-weight request to pay for.
 */
export const headingFont = Fredoka({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

/**
 * Google renamed this family to "Nunito Sans 12pt", so Next 14's metrics table
 * misses the "Nunito Sans" lookup and logs `Failed to find font override
 * values`. Its automatic size-adjusted fallback is therefore switched off and
 * replaced with `--font-body-fallback`, an @font-face in globals.css carrying
 * the same overrides computed by hand from those metrics. Without this the
 * swap from Arial to Nunito Sans reflows body text and costs us CLS.
 */
export const bodyFont = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['ai-kids-nunito-fallback', 'ui-sans-serif', 'system-ui', 'sans-serif'],
});
