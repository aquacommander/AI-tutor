#!/usr/bin/env node
/**
 * Turns a delivered lesson film into web-ready assets.
 *
 * Masters arrive far heavier than they need to be. The first one was 41.5 MB for
 * 3:08 — 1854 kbps for flat 2D animation, which compresses extremely well. At
 * CRF 30 the same film is 17 MB with an SSIM of 0.977 against the master:
 * measurably close, and visibly identical on the detailed frames (small text,
 * line art). Twenty of those is 340 MB instead of 830 MB.
 *
 * Produces, per film:
 *   - 720p / 480p / 360p MP4s, all with faststart so playback begins before the
 *     download finishes
 *   - an HLS ladder, so a child on a phone gets 360p and a child on fibre gets
 *     720p without anyone choosing
 *   - a WebP poster
 *   - the duration, to paste into src/data/lesson-videos.ts
 *
 * Usage:
 *   node scripts/build-video.mjs "master.mp4" ai-detective-academy sound-safari
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const [source, courseId, lessonId] = process.argv.slice(2);

if (!source || !courseId || !lessonId) {
  console.error('Usage: node scripts/build-video.mjs <source> <courseId> <lessonId>');
  process.exit(1);
}
if (!existsSync(source)) {
  console.error(`No such file: ${source}`);
  process.exit(1);
}

const outDir = join('public', 'videos', courseId);
const posterDir = join('public', 'images', 'video-posters');
const hlsDir = join(outDir, lessonId);
mkdirSync(outDir, { recursive: true });
mkdirSync(posterDir, { recursive: true });
mkdirSync(hlsDir, { recursive: true });

const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', ...args], { stdio: 'inherit' });
const probe = (args) =>
  execFileSync('ffprobe', ['-v', 'error', ...args], { encoding: 'utf8' }).trim();

const duration = Number(
  probe(['-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', source]),
);
const mb = (path) => (statSync(path).size / 1048576).toFixed(1);

/**
 * CRF 30 at 720p, 28 at the smaller sizes. Flat animation holds up far better
 * than live action here — verify with SSIM if a future film is photographic.
 */
const RENDITIONS = [
  { name: '720p', height: 720, width: 1280, crf: 30, audio: '64k' },
  { name: '480p', height: 480, width: 854, crf: 28, audio: '64k' },
  { name: '360p', height: 360, width: 640, crf: 30, audio: '48k' },
];

console.log(`Source: ${source} (${mb(source)} MB, ${duration.toFixed(1)}s)\n`);

// The 720p MP4 is the one the site points at today; the rest are for HLS and
// for anywhere that cannot play a playlist.
for (const rendition of RENDITIONS) {
  const isPrimary = rendition.name === '720p';
  const out = isPrimary
    ? join(outDir, `${lessonId}.mp4`)
    : join(hlsDir, `${lessonId}-${rendition.name}.mp4`);

  ff([
    '-i', source,
    '-vf', `scale=${rendition.width}:${rendition.height}`,
    '-c:v', 'libx264',
    '-crf', String(rendition.crf),
    '-preset', 'medium',
    '-profile:v', 'high',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', rendition.audio,
    '-movflags', '+faststart',
    out, '-y',
  ]);
  console.log(`  ${rendition.name.padEnd(6)} ${mb(out).padStart(6)} MB  ${out}`);
}

// HLS ladder. Segments are 6s, the usual trade between startup speed and
// request count.
ff([
  '-i', source,
  '-filter_complex',
  '[0:v]split=3[v1][v2][v3];[v1]scale=w=1280:h=720[v1out];[v2]scale=w=854:h=480[v2out];[v3]scale=w=640:h=360[v3out]',
  '-map', '[v1out]', '-c:v:0', 'libx264', '-crf:v:0', '30',
  '-map', '[v2out]', '-c:v:1', 'libx264', '-crf:v:1', '28',
  '-map', '[v3out]', '-c:v:2', 'libx264', '-crf:v:2', '30',
  '-map', 'a:0', '-map', 'a:0', '-map', 'a:0',
  '-c:a', 'aac', '-b:a', '64k',
  '-preset', 'medium', '-pix_fmt', 'yuv420p',
  '-f', 'hls',
  '-hls_time', '6',
  '-hls_playlist_type', 'vod',
  '-hls_flags', 'independent_segments',
  '-hls_segment_filename', join(hlsDir, 'v%v/segment%03d.ts'),
  '-master_pl_name', 'master.m3u8',
  '-var_stream_map', 'v:0,a:0 v:1,a:1 v:2,a:2',
  join(hlsDir, 'v%v/playlist.m3u8'),
  '-y',
]);
console.log(`  hls          ${join(hlsDir, 'master.m3u8')}`);

// Poster from a couple of seconds in — frame zero is usually a fade from black.
const poster = join(posterDir, `${lessonId}.webp`);
ff(['-ss', '2.5', '-i', source, '-frames:v', '1', '-vf', 'scale=1280:-1', '-q:v', '80', poster, '-y']);
console.log(`  poster ${mb(poster).padStart(6)} MB  ${poster}`);

console.log(`
Add to src/data/lesson-videos.ts:

  '${courseId}/${lessonId}': {
    src: '/videos/${courseId}/${lessonId}.mp4',
    poster: '/images/video-posters/${lessonId}.webp',
    durationSeconds: ${Math.round(duration)},
    chapters: [ /* ask the editor for the chapter list from the final edit */ ],
    pauses: [ /* the two scripted "pause and have a go" moments */ ],
  },
`);
