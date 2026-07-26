import manifest from '@/data/image-manifest.json';

export type ImageKey = keyof typeof manifest;

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
}

/**
 * Resolve a generated asset to the props `next/image` needs.
 *
 * Dimensions come from `image-manifest.json`, which `scripts/build-assets.mjs`
 * writes from the real output files. Hand-typed sizes drift the moment artwork
 * is re-exported; reading them keeps the reserved box exact, so replacing an
 * asset can never introduce layout shift.
 */
export function img(key: ImageKey): ImageAsset {
  const entry = manifest[key];
  return { src: `/images/${key}`, width: entry.width, height: entry.height };
}

/**
 * Just the path, for images rendered with `fill`.
 *
 * `next/image` throws if it is given both `fill` and a `width`, so a `fill`
 * image must not receive the spread from `img()`. Note that this only throws in
 * development — a production build accepts the same markup silently, so the
 * mistake will not show up in `next build` or in anything checked against
 * `next start`.
 */
export function imgSrc(key: ImageKey): string {
  return `/images/${key}`;
}
