import { Fragment } from 'react';

/** Matches `**bold**` first, so a bold run is never mistaken for two italics. */
const TOKEN = /(\*\*[^*]+\*\*|\*[^*\n]+\*)/g;

/**
 * Renders the light emphasis markup used in story text — `**bold**` and
 * `*italic*` — as real elements.
 *
 * Deliberately not a Markdown library and deliberately not
 * `dangerouslySetInnerHTML`: story text is authored content that ends up on a
 * page for children, so it goes through React's escaping like everything else.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter(Boolean);

  return (
    <>
      {parts.map((part, index) => {
        const key = `${index}-${part.slice(0, 12)}`;

        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={key}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={key}>{part.slice(1, -1)}</em>;
        }
        return <Fragment key={key}>{part}</Fragment>;
      })}
    </>
  );
}
