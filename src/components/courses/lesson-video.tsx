'use client';

import { useCallback, useRef, useState } from 'react';
import { ArrowRight, Lightbulb, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CHARACTERS } from '@/data/characters';
import { formatDuration } from '@/lib/lesson-time';
import { cn } from '@/lib/utils';
import type { Lesson, LessonVideo } from '@/types/course';

/**
 * The lesson film, with the script's pause points enforced.
 *
 * A plain player would let a child watch straight through, and the two moments
 * where the tutor says "pause and have a go" would pass by unnoticed. So the
 * player stops itself at those moments, puts the question on screen, and only
 * resumes when the child presses the button. The thinking cannot be skipped —
 * which is the "play first, explain last" rule enforced by the interface rather
 * than trusted to a seven-year-old.
 *
 * Chapters come from the same scene list as the written lesson, so a child who
 * missed a bit can jump back to "The big idea" instead of scrubbing a timeline.
 */

interface LessonVideoPlayerProps {
  video: LessonVideo;
  lesson: Lesson;
  /** Fired once, when enough has been watched to count as done. */
  onWatched: () => void;
}

/** Enough of the film to count as watched — the last seconds are credits. */
const WATCHED_FRACTION = 0.9;

/** The tutor's question, without the answer that follows "Welcome back." */
function promptFor(lesson: Lesson, sceneId: string): string {
  const scene = lesson.scenes.find((entry) => entry.id === sceneId);
  const text = scene?.turns[0]?.text ?? '';
  const marker = text.indexOf('Welcome back.');
  const prompt = marker === -1 ? text : text.slice(0, marker);
  // Strip the spoken instruction to pause; the button is the pause now.
  return prompt
    .replace(/Pause the video[^.]*\.\s*/gi, '')
    .replace(/Pause for up to[^.]*\.\s*/gi, '')
    .replace(/^Tutor:\s*/i, '')
    .trim();
}

export function LessonVideoPlayer({ video, lesson, onWatched }: LessonVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTime = useRef(0);
  const watched = useRef(false);

  const [activePause, setActivePause] = useState<string | null>(null);
  const [answered, setAnswered] = useState<string[]>([]);
  const [chapter, setChapter] = useState(0);
  const [started, setStarted] = useState(false);

  const onTimeUpdate = useCallback(() => {
    const element = videoRef.current;
    if (!element) return;

    const now = element.currentTime;
    const previous = lastTime.current;
    lastTime.current = now;

    const current = [...video.chapters].reverse().find((entry) => now >= entry.start);
    if (current) setChapter(video.chapters.indexOf(current));

    if (!watched.current && now >= video.durationSeconds * WATCHED_FRACTION) {
      watched.current = true;
      onWatched();
    }

    // Only on natural playback across the mark. Seeking past it on purpose is
    // the child's choice, and re-pausing an already answered prompt would nag.
    const due = video.pauses.find(
      (pause) => previous < pause.at && now >= pause.at && !answered.includes(pause.sceneId),
    );
    if (due) {
      element.pause();
      setActivePause(due.sceneId);
    }
  }, [answered, onWatched, video]);

  const resume = () => {
    if (activePause) setAnswered((current) => [...current, activePause]);
    setActivePause(null);
    void videoRef.current?.play();
  };

  const seekTo = (seconds: number) => {
    const element = videoRef.current;
    if (!element) return;
    element.currentTime = seconds;
    lastTime.current = seconds;
    setActivePause(null);
    void element.play();
    setStarted(true);
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden p-0">
        <div className="relative bg-ink">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- subtitles are
              pending from the video editor; tracked as a release blocker. The
              full script is available below as a transcript in the meantime. */}
          <video
            ref={videoRef}
            src={video.src}
            poster={video.poster}
            controls
            playsInline
            preload="metadata"
            onTimeUpdate={onTimeUpdate}
            onPlay={() => setStarted(true)}
            onSeeked={() => {
              lastTime.current = videoRef.current?.currentTime ?? 0;
            }}
            className="aspect-video w-full"
          >
            {video.captions ? (
              <track kind="captions" src={video.captions} srcLang="en" label="English" default />
            ) : null}
            Your browser cannot play this video. You can read the whole lesson below instead.
          </video>

          {/* A big friendly target over the poster; the native play button is
              small and easy for a young child to miss. */}
          {!started ? (
            <button
              type="button"
              onClick={() => seekTo(0)}
              className="absolute inset-0 flex items-center justify-center bg-ink/30 transition-colors hover:bg-ink/40"
            >
              <span className="flex size-20 items-center justify-center rounded-full bg-primary text-white shadow-button motion-safe:animate-float">
                <Play className="size-9 fill-current" aria-hidden="true" />
              </span>
              <span className="sr-only">Play the lesson film</span>
            </button>
          ) : null}
        </div>
      </Card>

      {/* The pause point. */}
      {activePause ? (
        <Card role="status" className="border-primary bg-primary-surface">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary-dark">
            <Lightbulb className="size-4" aria-hidden="true" />
            {CHARACTERS.tutor.name} has stopped the film — your turn to think
          </p>
          <p className="mt-3 text-lg leading-relaxed sm:text-xl">
            {promptFor(lesson, activePause)}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            Say your answer out loud, or tell someone next to you.
          </p>
          <Button size="lg" onClick={resume} className="mt-4 w-full">
            I&rsquo;ve had a go — keep playing
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </Card>
      ) : null}

      {/* Chapters */}
      <nav aria-label="Jump to part of the film">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-muted">
          Jump to a part · whole film {formatDuration(video.durationSeconds)}
        </p>
        <ul className="flex flex-wrap gap-2">
          {video.chapters.map((entry, index) => (
            <li key={entry.sceneId}>
              <button
                type="button"
                onClick={() => seekTo(entry.start)}
                aria-current={index === chapter ? 'true' : undefined}
                className={cn(
                  'min-h-[44px] rounded-button border-2 px-3.5 text-sm font-semibold',
                  'transition-[transform,background-color,border-color] duration-200',
                  'hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
                  index === chapter
                    ? 'border-primary bg-primary text-white'
                    : 'border-border-soft bg-surface text-ink hover:border-primary/50 hover:bg-primary-surface',
                )}
              >
                {entry.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* The written lesson stays available: no sound, no headphones, a noisy
          room, or simply preferring to read are all normal. */}
      <details className="rounded-card border border-border-soft bg-surface p-4 shadow-card">
        <summary className="cursor-pointer font-heading font-bold">
          Read the lesson instead
        </summary>
        <div className="mt-4 space-y-4">
          {lesson.scenes.map((scene) => (
            <section key={scene.id}>
              <h3 className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                {scene.label}
              </h3>
              {scene.turns.map((turn, index) => (
                <p key={index} className="mt-1 leading-relaxed">
                  {turn.speaker === 'glitch' ? (
                    <span className="font-heading font-bold text-coral-dark">
                      {CHARACTERS.glitch.name}:{' '}
                    </span>
                  ) : null}
                  {turn.text}
                </p>
              ))}
            </section>
          ))}
        </div>
      </details>
    </div>
  );
}
