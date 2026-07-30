import { Fragment, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Renders the small slice of Markdown Sparky is asked to produce: paragraphs,
 * lists, `inline code`, fenced code blocks, **bold** and *italic*.
 *
 * Written by hand rather than pulled from a library for two reasons. Model
 * output is untrusted, so nothing here goes near `dangerouslySetInnerHTML` —
 * every value reaches the DOM through React's escaping. And text arrives one
 * chunk at a time, so the parser has to cope with markup that is not finished
 * yet: a fence with no closing fence renders as a code block that is still
 * being written, rather than as three stray backticks.
 */

interface AiMarkdownProps {
  text: string;
  className?: string;
}

export function AiMarkdown({ text, className }: AiMarkdownProps) {
  // Even segments are prose, odd segments are inside a fence. An unterminated
  // fence simply leaves the last odd segment open, which is what we want.
  const segments = text.split('```');

  return (
    <div className={cn('space-y-3', className)}>
      {segments.map((segment, index) => {
        if (index % 2 === 1) return <CodeBlock key={index} raw={segment} />;
        return <Fragment key={index}>{renderProse(segment)}</Fragment>;
      })}
    </div>
  );
}

function CodeBlock({ raw }: { raw: string }) {
  // ```python\nprint("hi")  ->  drop the language tag, keep the code.
  const newline = raw.indexOf('\n');
  const firstLine = newline === -1 ? raw : raw.slice(0, newline);
  const hasLanguageTag = newline !== -1 && /^[a-z0-9+#-]*$/i.test(firstLine.trim());
  const code = (hasLanguageTag ? raw.slice(newline + 1) : raw).replace(/\n+$/, '');

  return (
    <pre className="overflow-x-auto rounded-card bg-ink px-4 py-3 text-sm leading-relaxed text-white">
      <code>{code}</code>
    </pre>
  );
}

const BULLET = /^\s*[-*•]\s+/;
const NUMBERED = /^\s*\d+[.)]\s+/;

/**
 * Sparky is told to avoid headings, but it uses one for a story title and will
 * occasionally reach for one elsewhere — and an unhandled `#` renders as a
 * literal hash on screen, which is what a child would see.
 *
 * Rendered as a styled paragraph rather than a real `<h3>`: generated text
 * arrives at unpredictable heading levels inside a page that already has an h1
 * and h2, and emitting those would corrupt the document outline that screen
 * reader users navigate by. It looks identical and cannot do that damage.
 */
const HEADING = /^(#{1,6})\s+(.+)$/;

function renderProse(prose: string): ReactNode {
  const nodes: ReactNode[] = [];
  let key = 0;

  for (const block of prose.split(/\n{2,}/)) {
    const lines = block.split('\n').filter((line) => line.trim().length > 0);
    if (lines.length === 0) continue;

    if (lines.every((line) => BULLET.test(line))) {
      nodes.push(
        <ul key={key++} className="ml-5 list-disc space-y-1">
          {lines.map((line, i) => (
            <li key={i}>{renderInline(line.replace(BULLET, ''))}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (lines.every((line) => NUMBERED.test(line))) {
      nodes.push(
        <ol key={key++} className="ml-5 list-decimal space-y-1">
          {lines.map((line, i) => (
            <li key={i}>{renderInline(line.replace(NUMBERED, ''))}</li>
          ))}
        </ol>,
      );
      continue;
    }

    let paragraph: string[] = [];
    const flushParagraph = () => {
      if (paragraph.length === 0) return;
      const lines = paragraph;
      paragraph = [];
      nodes.push(
        <p key={key++}>
          {lines.map((line, i) => (
            <Fragment key={i}>
              {i > 0 ? <br /> : null}
              {renderInline(line)}
            </Fragment>
          ))}
        </p>,
      );
    };

    for (const line of lines) {
      const heading = HEADING.exec(line);
      if (!heading) {
        paragraph.push(line);
        continue;
      }
      flushParagraph();
      nodes.push(
        <p key={key++} className="font-heading text-lg font-bold">
          {renderInline(heading[2] ?? '')}
        </p>,
      );
    }

    flushParagraph();
  }

  return nodes;
}

/** Inline code first, so backticked text is never re-parsed as emphasis. */
const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\n]+\*)/g;

function renderInline(line: string): ReactNode {
  return line
    .split(INLINE)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
        return (
          <code
            key={index}
            className="rounded bg-primary-surface px-1.5 py-0.5 font-mono text-[0.9em] text-primary-dark"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 1) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      return <Fragment key={index}>{part}</Fragment>;
    });
}
