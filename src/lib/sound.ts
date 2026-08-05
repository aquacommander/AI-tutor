/**
 * Tiny sound synthesiser for the listening activities.
 *
 * The lessons need a child to hear rain, a bird, a clock and so on and work out
 * what made the sound. There are no audio files in this project and
 * commissioning them is a production job, so these are generated with the Web
 * Audio API — noise shaped by filters and envelopes.
 *
 * Two child-safety rules from the activity specification are enforced here
 * rather than left to callers: every envelope ramps in over ~10ms so nothing
 * ever clicks or starts abruptly, and every peak is scaled by a master gain
 * capped well below full scale. There are no sudden or extremely loud sounds
 * because the synthesiser cannot produce one.
 *
 * Everything is created on demand and torn down after playing, so a page that
 * never plays a sound never opens an audio context.
 */

export type SoundName =
  | 'rain'
  | 'tapping'
  | 'bird'
  | 'roar'
  | 'applause'
  | 'splash'
  | 'beep'
  | 'dog'
  | 'clock'
  | 'train'
  | 'drum';

let context: AudioContext | null = null;

/**
 * The nodes currently making a noise, and the gain they all pass through.
 *
 * Without this there is no way to stop a sound early: oscillators and buffer
 * sources are fire-and-forget once started. Keeping the bus lets `stopSound`
 * fade out over 40ms rather than cutting, which would click.
 */
let playing: { bus: GainNode; sources: AudioScheduledSourceNode[] } | null = null;

/** 0 to 1. Nothing reaches the speakers above this fraction of the envelope. */
let masterVolume = 0.7;

export function setVolume(value: number) {
  masterVolume = Math.min(1, Math.max(0, value));
}

export function getVolume(): number {
  return masterVolume;
}

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  // Browsers start the context suspended until a user gesture. Every call here
  // is behind a button press, so resuming is safe.
  if (!context) context = new Ctor();
  if (context.state === 'suspended') void context.resume();
  return context;
}

function noiseBuffer(ctx: AudioContext, seconds: number) {
  const buffer = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * seconds)), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** A fresh bus for one play, replacing whatever was sounding before. */
function openBus(ctx: AudioContext): GainNode {
  stopSound();
  const bus = ctx.createGain();
  bus.gain.value = 1;
  bus.connect(ctx.destination);
  playing = { bus, sources: [] };
  return bus;
}

/** Stops anything currently sounding, with a short fade so it cannot click. */
export function stopSound() {
  if (!playing || !context) return;
  const { bus, sources } = playing;
  playing = null;

  const now = context.currentTime;
  bus.gain.cancelScheduledValues(now);
  bus.gain.setValueAtTime(Math.max(0.0001, bus.gain.value), now);
  bus.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

  for (const source of sources) {
    try {
      source.stop(now + 0.05);
    } catch {
      /* already stopped */
    }
  }
}

export function isPlaying(): boolean {
  return playing !== null;
}

function envelope(gain: GainNode, at: number, peak: number, hold: number, fall: number) {
  const level = Math.max(0.0002, peak * masterVolume);
  gain.gain.setValueAtTime(0.0001, at);
  // ~10ms attack: fast enough to sound percussive, slow enough never to click.
  gain.gain.exponentialRampToValueAtTime(level, at + 0.01);
  gain.gain.setValueAtTime(level, at + Math.max(0.011, hold));
  gain.gain.exponentialRampToValueAtTime(0.0001, at + hold + fall);
}

function tone(
  ctx: AudioContext,
  bus: GainNode,
  type: OscillatorType,
  from: number,
  to: number,
  at: number,
  length: number,
  peak = 0.2,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), at + length);
  envelope(gain, at, peak, length * 0.4, length * 0.6);
  osc.connect(gain).connect(bus);
  osc.start(at);
  osc.stop(at + length + 0.1);
  playing?.sources.push(osc);
}

function noise(
  ctx: AudioContext,
  bus: GainNode,
  at: number,
  length: number,
  cutoff: number,
  peak = 0.15,
  type: BiquadFilterType = 'lowpass',
) {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx, length);
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = cutoff;
  const gain = ctx.createGain();
  envelope(gain, at, peak, length * 0.5, length * 0.5);
  source.connect(filter).connect(gain).connect(bus);
  source.start(at);
  source.stop(at + length);
  playing?.sources.push(source);
}

/** Plays a sound. Returns false when the browser gives us no audio at all. */
export function playSound(name: SoundName): boolean {
  const ctx = audio();
  if (!ctx) return false;

  const bus = openBus(ctx);
  const now = ctx.currentTime + 0.02;

  switch (name) {
    case 'rain':
      // Steady filtered hiss with heavier drops over the top.
      noise(ctx, bus, now, 2.2, 1800, 0.12);
      for (let i = 0; i < 12; i += 1) noise(ctx, bus, now + Math.random() * 2, 0.05, 4000, 0.06);
      return true;

    case 'tapping':
      for (let i = 0; i < 5; i += 1) noise(ctx, bus, now + i * 0.28, 0.05, 2500, 0.25);
      return true;

    case 'bird':
      // Short, very high, repeated — the top of the pitch range.
      for (let i = 0; i < 4; i += 1) {
        tone(ctx, bus, 'sine', 2400 + i * 120, 3400, now + i * 0.22, 0.12, 0.18);
      }
      return true;

    case 'roar':
      tone(ctx, bus, 'sawtooth', 110, 55, now, 1.4, 0.28);
      noise(ctx, bus, now, 1.4, 500, 0.14);
      return true;

    case 'applause':
      for (let i = 0; i < 40; i += 1) noise(ctx, bus, now + Math.random() * 1.8, 0.04, 3500, 0.05);
      return true;

    case 'splash':
      noise(ctx, bus, now, 0.5, 900, 0.25);
      tone(ctx, bus, 'sine', 700, 180, now, 0.35, 0.12);
      return true;

    case 'beep':
      tone(ctx, bus, 'square', 880, 880, now, 0.18, 0.15);
      return true;

    case 'dog':
      // Two barks: a low-mid burst with a fast downward sweep.
      for (const offset of [0, 0.5]) {
        tone(ctx, bus, 'sawtooth', 420, 170, now + offset, 0.22, 0.26);
        noise(ctx, bus, now + offset, 0.2, 1400, 0.14);
      }
      return true;

    case 'clock':
      // Very short, very even. Rhythm is the whole clue here.
      for (let i = 0; i < 5; i += 1) {
        noise(ctx, bus, now + i * 0.55, 0.03, 5000, 0.16, 'highpass');
      }
      return true;

    case 'train':
      // Low rolling rumble with a slow chuff over it.
      noise(ctx, bus, now, 2.4, 260, 0.18);
      for (let i = 0; i < 6; i += 1) {
        noise(ctx, bus, now + i * 0.4, 0.16, 900, 0.1);
        tone(ctx, bus, 'triangle', 90, 70, now + i * 0.4, 0.16, 0.1);
      }
      return true;

    case 'drum':
      // Kick-drum thump: pitch falls fast, steady beat.
      for (let i = 0; i < 5; i += 1) {
        tone(ctx, bus, 'sine', 160, 45, now + i * 0.5, 0.28, 0.3);
        noise(ctx, bus, now + i * 0.5, 0.06, 700, 0.08);
      }
      return true;
  }
}

/** Tears the audio context down entirely. For unmount, not for pausing. */
export function stopAllSound() {
  stopSound();
  if (context) {
    void context.close();
    context = null;
    playing = null;
  }
}
