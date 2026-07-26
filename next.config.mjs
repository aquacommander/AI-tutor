/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  /*
   * `next dev` and `next build` both write to `.next` by default, so running a
   * production build while a dev server is up clobbers the dev server's
   * artifacts (and vice versa) — the running app starts 500ing on its own CSS.
   *
   * Setting NEXT_DIST_DIR gives a build its own output directory:
   *   NEXT_DIST_DIR=.next-verify npm run build
   */
  distDir: process.env.NEXT_DIST_DIR || '.next',
};

export default nextConfig;
