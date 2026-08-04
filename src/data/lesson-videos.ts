import type { LessonVideo } from '@/types/course';

/**
 * Films, keyed by `courseId/lessonId`.
 *
 * Deliberately **not** in the generated lesson files: those are rebuilt from
 * AI_for_Kids_Complete_Course_Material.docx by `scripts/curriculum/`, and a
 * re-import would wipe anything hand-added there. Video is a production
 * artifact with its own lifecycle, so it lives beside the lessons instead.
 *
 * ## About these timings
 *
 * The course document scripts a 10-minute film with scenes at 0:50, 1:45, 3:00
 * and so on. The delivered edit runs **3:08** — the same eight scenes, uniformly
 * compressed. Using the document's timecodes would put the second pause at 6:05,
 * past the end of the file.
 *
 * So the chapter starts below are the script's proportions scaled to the real
 * duration, then checked against frames pulled from the film itself: the
 * silhouette countdown, Maya's "Great!" reveal, the blurry rabbit choice, and
 * the Glitch Alert all land where this table says they should.
 *
 * They are derived, not supplied. **The editor should confirm them** — and for
 * every future lesson, a chapter list exported from the finished edit costs
 * them a minute and removes the guesswork entirely.
 */
export const lessonVideos: Record<string, LessonVideo> = {
  'ai-detective-academy/picture-clue-patrol': {
    src: '/videos/ai-detective-academy/picture-clue-patrol.mp4',
    poster: '/images/video-posters/picture-clue-patrol.webp',
    durationSeconds: 188,
    chapters: [
      { sceneId: 'cold-open', label: 'The mystery', start: 0 },
      { sceneId: 'mission-briefing', label: 'Your mission', start: 16 },
      { sceneId: 'try-before-telling', label: 'Have a guess', start: 33 },
      { sceneId: 'the-big-ai-idea', label: 'The big idea', start: 56 },
      { sceneId: 'worked-example', label: 'Cat, fox or toy?', start: 86 },
      { sceneId: 'your-turn', label: 'Your turn', start: 114 },
      { sceneId: 'glitch-alert', label: "Glitch's mistake", start: 139 },
      { sceneId: 'recap-and-badge', label: 'Well done!', start: 160 },
    ],
    // Set just before each on-screen reveal, so the question has been asked and
    // the countdown seen, but the answer has not been given away.
    pauses: [
      { sceneId: 'try-before-telling', at: 49 },
      { sceneId: 'your-turn', at: 128 },
    ],
  },
};

export function findLessonVideo(courseId: string, lessonId: string): LessonVideo | undefined {
  return lessonVideos[`${courseId}/${lessonId}`];
}
