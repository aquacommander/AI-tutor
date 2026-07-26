#!/usr/bin/env node
/**
 * Guards a `next/image` mistake that only fails in development.
 *
 * `<Image fill>` must not also receive a `width`. `getImgProps` throws on the
 * combination — but the check sits behind `process.env.NODE_ENV !== 'production'`,
 * so `next build`, `next start`, and anything verified against them stay green
 * while every page 500s under `next dev`.
 *
 * `img()` returns `{ src, width, height }`, so spreading it onto a `fill` image
 * is exactly that mistake. Use `imgSrc()` there instead.
 *
 * TypeScript does not catch it: Next's ImageProps union is defeated by a spread.
 *
 * Usage:
 *   node scripts/check-image-props.mjs              scan src/
 *   node scripts/check-image-props.mjs --self-test  prove the check still works
 *
 * The self-test runs against fixtures in a temp directory. It must never edit
 * anything under src/ — a dev server watching those files will compile the
 * broken state and can hold on to it after the file is restored.
 */
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith('.tsx')) yield full;
  }
}

async function scan(root, label) {
  const problems = [];

  for await (const file of walk(root)) {
    const source = await readFile(file, 'utf8');

    // Each JSX <Image ... /> element, comments stripped so a mention of `fill`
    // in prose does not trip the check.
    for (const match of source.matchAll(/<Image\b[\s\S]*?\/>/g)) {
      // Both comment forms are legal inside a JSX tag: `{/* … */}` and a bare
      // `/* … */` between attributes. Strip both, or prose mentioning `fill`
      // reads as the prop.
      const tag = match[0].replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

      const hasFill = /(^|\s)fill(\s|$|=)/.test(tag);
      const hasSpreadWidth = /\{\s*\.\.\.\s*img\(/.test(tag);
      const hasLiteralWidth = /(^|\s)width\s*=/.test(tag);

      if (hasFill && (hasSpreadWidth || hasLiteralWidth)) {
        const line = source.slice(0, match.index).split('\n').length;
        problems.push(
          `${file.replace(`${root}/`, `${label}/`)}:${line} — <Image fill> also receives a ` +
            `width (${hasSpreadWidth ? 'via the img() spread' : 'as a literal prop'}). ` +
            `Use imgSrc() for fill images.`,
        );
      }
    }
  }

  return problems;
}

/** Confirms the check still detects the real mistake, and still allows the fix. */
async function selfTest() {
  const dir = await mkdtemp(join(tmpdir(), 'image-props-'));
  await mkdir(join(dir, 'nested'), { recursive: true });

  await writeFile(
    join(dir, 'bad-spread.tsx'),
    `<Image {...img('a.webp')} alt="" fill sizes="100vw" />`,
  );
  await writeFile(
    join(dir, 'nested', 'bad-literal.tsx'),
    `<Image src="/a.webp" alt="" width={10} height={10} fill />`,
  );
  await writeFile(
    join(dir, 'good-fill.tsx'),
    `<Image src={imgSrc('a.webp')} alt="" fill sizes="100vw" />`,
  );
  await writeFile(join(dir, 'good-sized.tsx'), `<Image {...img('a.webp')} alt="" sizes="80px" />`);
  // A comment mentioning fill must not be mistaken for the prop.
  await writeFile(
    join(dir, 'good-comment.tsx'),
    `<Image {...img('a.webp')} alt="" sizes="80px" /* not fill */ />`,
  );

  const found = await scan(dir, 'fixture');
  await rm(dir, { recursive: true, force: true });

  const caught = found.length;
  const ok = caught === 2;
  console.log(`${ok ? '✔' : '✖'} self-test: caught ${caught}/2 planted problems, 3 valid files passed`);
  if (!ok) {
    for (const p of found) console.error(`   ${p}`);
    process.exit(1);
  }
}

if (process.argv.includes('--self-test')) {
  await selfTest();
} else {
  const problems = await scan(SRC, 'src');

  if (problems.length > 0) {
    console.error(`✖ ${problems.length} next/image problem(s):\n`);
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }

  console.log('✔ No next/image fill/width conflicts');
}
