#!/usr/bin/env node
/**
 * Builds the optimised web asset set from the supplied artwork.
 *
 *   assets/source/<n>.png   1536x1024 RGBA, subject centred in transparent space
 *        |
 *        v  trim transparent margin -> resize -> WebP
 *   public/images/<slot>.webp
 *
 * Sources stay out of `public/` on purpose: they are ~2.4 MB each and would
 * otherwise all be deployed. Only the generated WebP files ship.
 *
 * Every entry is `[sourceId, outputPath, width, height, fit]`:
 *   - `width`/`height` are the intrinsic pixel size written to disk, chosen at
 *     roughly 2x the largest size the layout displays the asset at.
 *   - `fit: 'inside'` scales the trimmed artwork to fit the box and writes
 *     whatever size results, preserving the artwork's own aspect ratio.
 *   - `fit: 'contain'` pads to exactly width x height with transparency. Used
 *     for the 16:9 card thumbnails so the illustration floats on the card's
 *     own tint instead of being cropped.
 *
 * Usage: node scripts/build-assets.mjs
 */
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets', 'source');
const OUT = join(ROOT, 'public', 'images');

const CARD = ['contain', 720, 405]; // 16:9 lesson and course thumbnails

/**
 * Source is either a number (`12` -> `12.png`) or an explicit filename, for
 * artwork that arrives outside the numbered set.
 *
 * @type {Array<[number|string, string, number, number, 'inside'|'contain']>}
 */
const ASSETS = [
  // ---- brand ----
  [10, 'brand/logo.webp', 560, 300, 'inside'],
  [19, 'brand/wordmark.webp', 640, 200, 'inside'],
  [18, 'brand/sparky-avatar.webp', 256, 256, 'inside'],
  [17, 'brand/sparky-tile.webp', 512, 512, 'inside'],

  // ---- hero ----
  [20, 'hero/children-tablet.webp', 1100, 1100, 'inside'],
  [16, 'hero/sparky.webp', 700, 1100, 'inside'],
  [9, 'hero/planet.webp', 320, 320, 'inside'],
  [8, 'hero/spaceship.webp', 400, 400, 'inside'],
  [7, 'hero/castle.webp', 440, 440, 'inside'],
  [5, 'hero/cloud-small.webp', 600, 600, 'inside'],
  [6, 'hero/cloud-large.webp', 800, 800, 'inside'],
  [4, 'hero/sparkles.webp', 320, 320, 'inside'],

  // ---- age groups ----
  [15, 'age-groups/explorer.webp', 360, 360, 'inside'],
  [13, 'age-groups/builder.webp', 360, 360, 'inside'],
  [14, 'age-groups/creator.webp', 360, 360, 'inside'],

  // ---- learning modules ----
  [3, 'features/sparky-tutor.webp', 256, 256, 'inside'],
  [2, 'features/code-lab.webp', 256, 256, 'inside'],
  [1, 'features/creative-studio.webp', 256, 256, 'inside'],
  [30, 'features/courses.webp', 256, 256, 'inside'],

  // ---- safety ----
  [12, 'safety/shield.webp', 256, 256, 'inside'],
  [11, 'safety/family.webp', 840, 840, 'inside'],

  // ---- featured lessons ----
  [29, 'lessons/meet-sparky.webp', ...CARD.slice(1), CARD[0]],
  [28, 'lessons/train-your-ai.webp', ...CARD.slice(1), CARD[0]],
  [27, 'lessons/ai-art-studio.webp', ...CARD.slice(1), CARD[0]],
  [26, 'lessons/smart-city.webp', ...CARD.slice(1), CARD[0]],

  // ---- course tracks ----
  // No dedicated course artwork was supplied, so these reuse the closest
  // thematic illustration. Swap in bespoke art when it exists.
  [11, 'courses/ai-ethics.webp', ...CARD.slice(1), CARD[0]],
  [28, 'courses/data-science.webp', ...CARD.slice(1), CARD[0]],
  [2, 'courses/vision-nlp.webp', ...CARD.slice(1), CARD[0]],
  [26, 'courses/game-robotics.webp', ...CARD.slice(1), CARD[0]],

  // ---- story shelf ----
  // Only this one needs its own render: every other tale maps onto a lesson or
  // course illustration, but two tales were landing on the same source image
  // and sat next to each other on the shelf.
  [3, 'stories/whispering-wood.webp', ...CARD.slice(1), CARD[0]],

  // ---- footer ----
  ['footer.png', 'footer/banner.webp', 1400, 620, 'inside'],

  // ---- rewards and gamification ----
  [21, 'rewards/gift.webp', 256, 256, 'inside'],
  [22, 'rewards/rocket-badge.webp', 256, 256, 'inside'],
  [23, 'rewards/trophy.webp', 256, 256, 'inside'],
  [24, 'rewards/xp-coin.webp', 256, 256, 'inside'],
  [25, 'rewards/level-star.webp', 256, 256, 'inside'],
];

/**
 * App icons and the social card live under `src/app/` so Next picks them up by
 * filename convention. They are emitted as PNG: favicons and Open Graph
 * consumers cannot be relied on to read WebP.
 */
async function buildAppIcons() {
  const APP = join(ROOT, 'src', 'app');
  const tile = join(SRC, '17.png'); // Sparky on a rounded tile

  for (const [name, size] of [
    ['icon.png', 256],
    ['apple-icon.png', 180],
  ]) {
    // Palette-quantised: the favicon is requested on every page load, so a
    // full-colour 256px PNG (~165 KB) is not worth the fidelity at tab size.
    const info = await sharp(tile)
      .trim({ threshold: 1 })
      .resize(size, size, { fit: 'cover' })
      .png({ palette: true, quality: 90, compressionLevel: 9 })
      .toFile(join(APP, name));
    console.log(`${name.padEnd(34)} <- 17.png  ${size}x${size}  ${(info.size / 1024).toFixed(0)} KB`);
  }

  // Social card: brand gradient, Sparky, and the wordmark.
  const W = 1200;
  const H = 630;
  const sparky = await sharp(join(SRC, '16.png'))
    .trim({ threshold: 1 })
    .resize({ height: 460, fit: 'inside' })
    .toBuffer();
  const wordmark = await sharp(join(SRC, '19.png'))
    .trim({ threshold: 1 })
    .resize({ width: 560, fit: 'inside' })
    .toBuffer();

  const background = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#7148f5"/><stop offset="100%" stop-color="#2498f5"/>
      </linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#g)"/>
      <text x="620" y="400" font-family="sans-serif" font-size="34" fill="#ffffff" opacity="0.92">Learn AI through play, creativity,</text>
      <text x="620" y="446" font-family="sans-serif" font-size="34" fill="#ffffff" opacity="0.92">coding, and discovery.</text>
      <text x="620" y="516" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffc83d">Ages 6-16</text>
    </svg>`,
  );

  await sharp(background)
    .composite([
      { input: sparky, left: 90, top: 90 },
      { input: wordmark, left: 610, top: 150 },
    ])
    .png()
    .toFile(join(APP, 'opengraph-image.png'));
  console.log(`opengraph-image.png                <- 16 + 19.png  ${W}x${H}`);
}

async function build() {
  await rm(OUT, { recursive: true, force: true });

  const manifest = {};
  let totalBytes = 0;

  for (const [id, outPath, width, height, fit] of ASSETS) {
    const target = join(OUT, outPath);
    await mkdir(dirname(target), { recursive: true });

    const sourceFile = typeof id === 'number' ? `${id}.png` : id;

    let pipeline = sharp(join(SRC, sourceFile))
      // The artwork sits in a large transparent field; trim it so the asset's
      // intrinsic box is the artwork itself and layout sizing is predictable.
      .trim({ threshold: 1 })
      .resize({
        width,
        height,
        fit,
        withoutEnlargement: true,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      });

    pipeline = pipeline.webp({ quality: 82, effort: 6, alphaQuality: 90 });

    const info = await pipeline.toFile(target);
    totalBytes += info.size;
    manifest[outPath] = { source: sourceFile, width: info.width, height: info.height, bytes: info.size };

    console.log(
      `${outPath.padEnd(34)} <- ${sourceFile.padStart(10)}  ` +
        `${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`,
    );
  }

  // The manifest is what components import their intrinsic sizes from, so
  // next/image always reserves the exact right box and never shifts layout.
  await writeFile(
    join(ROOT, 'src', 'data', 'image-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  await buildAppIcons();

  const sources = (await readdir(SRC)).filter((f) => f.endsWith('.png')).length;
  console.log(
    `\n${ASSETS.length} assets from ${sources} sources — ${(totalBytes / 1024 / 1024).toFixed(2)} MB total`,
  );
}

await build();
