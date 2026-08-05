'use client';

import { useEffect, useRef, useState } from 'react';
import { Eraser, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Somewhere for a child to actually make the thing.
 *
 * The Evidence Investigator asks for "a blank canvas or text box" and is
 * explicit that no template, example or AI-generated starting point may be
 * offered — the point of the exercise is that the child made it and still
 * cannot prove that by showing you the result.
 *
 * Nothing here is saved. A drawing is a few hundred kilobytes of base64 and
 * localStorage holds about five megabytes in total; filling it with pictures
 * would evict a child's actual progress. They can print or screenshot it.
 */

const COLOURS = ['#2a1a47', '#7148f5', '#2498f5', '#29b866', '#ffc83d', '#ff6f66'];

export function DrawingCanvas({ label }: { label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [colour, setColour] = useState(COLOURS[0]!);
  const [width, setWidth] = useState(6);

  // The canvas is sized in device pixels so strokes are not blurry on a phone.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  const positionOf = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    // Capture keeps the stroke going if the finger leaves the canvas edge.
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    const { x, y } = positionOf(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = positionOf(event);
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = () => {
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <ul className="flex gap-2" aria-label="Pen colour">
          {COLOURS.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => setColour(option)}
                aria-label={`Colour ${option}`}
                aria-pressed={colour === option}
                style={{ backgroundColor: option }}
                className={cn(
                  'size-11 rounded-full border-4 transition-transform',
                  colour === option ? 'scale-110 border-ink' : 'border-white',
                )}
              />
            </li>
          ))}
        </ul>

        <label className="flex items-center gap-2 text-sm font-bold">
          Pen size
          <input
            type="range"
            min={2}
            max={24}
            value={width}
            onChange={(event) => setWidth(Number(event.target.value))}
            className="h-2 w-24 cursor-pointer appearance-none rounded-button bg-primary-light accent-primary"
          />
        </label>

        <Button variant="ghost" size="sm" onClick={clear}>
          <Eraser className="size-4" aria-hidden="true" />
          Start again
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        aria-label={label}
        className="mt-3 h-64 w-full touch-none rounded-card border-2 border-border-soft bg-white sm:h-80"
      />
      <p className="mt-2 text-sm text-ink-muted">
        Draw with a finger, a mouse or a pen. Nothing here is saved — print or
        screenshot it if you want to keep it.
      </p>
    </div>
  );
}

export function WritingBox({ label, sentences = 4 }: { label: string; sentences?: number }) {
  const [text, setText] = useState('');

  // Rough count, for encouragement rather than marking.
  const written = text.split(/[.!?]+/).filter((part) => part.trim().length > 2).length;

  return (
    <div>
      <label htmlFor="writing-box" className="block font-heading font-bold">
        {label}
      </label>
      <textarea
        id="writing-box"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={6}
        placeholder="Start writing…"
        className="mt-2 w-full rounded-card border-2 border-border-soft bg-surface p-4 text-lg leading-relaxed text-ink placeholder:text-ink-muted"
      />
      <p className="mt-2 text-sm font-bold text-ink-muted" aria-live="polite">
        {written} of {sentences} sentences
        {written >= sentences ? ' — that is plenty!' : ''}
      </p>
      <p className="text-sm text-ink-muted">
        Nothing here is saved. Copy it somewhere if you want to keep it.
      </p>
    </div>
  );
}

export function RotateHint() {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted sm:hidden">
      <RotateCcw className="size-4" aria-hidden="true" />
      Turn your phone sideways for more room.
    </p>
  );
}
