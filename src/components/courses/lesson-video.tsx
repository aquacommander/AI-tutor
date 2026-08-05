'use client';

import { useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDuration } from '@/lib/lesson-time';
import { imgSrc } from '@/lib/images';
import type { LessonVideo } from '@/types/course';

/**
 * The lesson film.
 *
 * Deliberately a plain player. An earlier version stopped itself part-way
 * through to ask a question, which suited a ten-minute film — but these run one
 * to three minutes, and the revised plan is explicit: "Place countdowns and
 * answer pauses in the interactive platform, not inside the short video." So the
 * thinking happens in the hook before it and the concept card after, and the
 * film is left alone.
 *
 * Replay is free and unlimited, which the plan also asks for.
 */

interface LessonVideoPlayerProps {
  video: LessonVideo;
  title: string;
  /** Fired once, when enough has been watched to count. */
  onWatched: () => void;
}

/** The tail is usually a sign-off, so this is "seen it", not "every frame". */
const WATCHED_FRACTION = 0.9;

export function LessonVideoPlayer({ video, title, onWatched }: LessonVideoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reported = useRef(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const replay = () => {
    const element = ref.current;
    if (!element) return;
    element.currentTime = 0;
    setFinished(false);
    void element.play();
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="relative bg-ink">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption -- subtitles are
            pending from the editor and sit on the plan's own release checklist.
            The concept card below carries the same definitions as text, so the
            lesson still works without audio in the meantime. */}
        <video
          ref={ref}
          src={video.src}
          poster={imgSrc(video.poster)}
          controls
          playsInline
          preload="metadata"
          onPlay={() => setStarted(true)}
          onEnded={() => setFinished(true)}
          onTimeUpdate={() => {
            const element = ref.current;
            if (!element || reported.current) return;
            if (element.currentTime >= video.durationSeconds * WATCHED_FRACTION) {
              reported.current = true;
              onWatched();
            }
          }}
          className="aspect-video w-full"
        >
          {video.captions ? (
            <track kind="captions" src={video.captions} srcLang="en" label="English" default />
          ) : null}
          Your browser cannot play this film. The concept card below covers the same idea.
        </video>

        {/* The plan's fix for unreadable generated text inside the scenes:
            "overlay a corrected title in the player". The films carry their own
            in-frame captions, several of them misspelled, so the authoritative
            title is the platform's and sits on top. */}
        <p className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-ink/80 to-transparent px-4 pb-8 pt-3 text-center font-heading text-sm font-bold text-white sm:text-base">
          {title}
        </p>

        {/* A big friendly target over the poster — the native play button is
            small and easy for a young child to miss. */}
        {!started ? (
          <button
            type="button"
            onClick={() => {
              setStarted(true);
              void ref.current?.play();
            }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/30 transition-colors hover:bg-ink/40"
          >
            <span className="flex size-20 items-center justify-center rounded-full bg-primary text-white shadow-button motion-safe:animate-float">
              <Play className="size-9 fill-current" aria-hidden="true" />
            </span>
            <span className="rounded-button bg-ink/70 px-3 py-1 text-sm font-bold text-white">
              {formatDuration(video.durationSeconds)}
            </span>
            <span className="sr-only">Play {title}</span>
          </button>
        ) : null}
      </div>

      {finished ? (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p className="font-heading font-bold">Watched it all — nice work!</p>
          <Button variant="ghost" size="sm" onClick={replay}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Watch again
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
