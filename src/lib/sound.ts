/**
 * Tiny sound synthesiser for the Sound Safari game.
 *
 * The lesson needs a child to hear rain, tapping, a bird and so on and work out
 * what made the sound. There are no audio files in this project and commissioning
 * them is a production job, so these are generated with the Web Audio API
 * instead — noise shaped by filters and envelopes. They are crude, which is
 * fine: the lesson is about picking out pitch, rhythm and noise, and a slightly
 * rough sound makes that easier rather than harder.
 *
 * Everything is created on demand and torn down after playing, so a page that
 * never plays a sound never opens an audio context.
 */

export type SoundName = 'rain' | 'tapping' | 'bird' | 'roar' | 'applause' | 'splash' | 'beep';

let context: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  // Browsers start the context suspended until a user gesture. Every call here
  // is behind a button press, so resuming is safe.
  if (!context) context = new Ctor();
  if (context.state === 'suspended') void context.resume();
  return context;
}

/** White noise buffer, the base for rain, splashes and applause. */
function noiseBuffer(ctx: AudioContext, seconds: number) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function envelope(ctx: AudioContext, gain: GainNode, at: number, peak: number, hold: number, fall: number) {
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + 0.01);
  gain.gain.setValueAtTime(peak, at + hold);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + hold + fall);
}

function tone(ctx: AudioContext, type: OscillatorType, from: number, to: number, at: number, length: number, peak = 0.2) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), at + length);
  envelope(ctx, gain, at, peak, length * 0.4, length * 0.6);
  osc.connect(gain).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + length + 0.1);
}

function noise(ctx: AudioContext, at: number, length: number, cutoff: number, peak = 0.15, type: BiquadFilterType = 'lowpass') {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx, length);
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = cutoff;
  const gain = ctx.createGain();
  envelope(ctx, gain, at, peak, length * 0.5, length * 0.5);
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(at);
  source.stop(at + length);
}

/** Plays a sound. Returns false when the browser gives us no audio at all. */
export function playSound(name: SoundName): boolean {
  const ctx = audio();
  if (!ctx) return false;

  const now = ctx.currentTime + 0.02;

  switch (name) {
    case 'rain':
      // Steady filtered hiss with a few heavier drops over the top.
      noise(ctx, now, 2.2, 1800, 0.12);
      for (let i = 0; i < 12; i += 1) noise(ctx, now + Math.random() * 2, 0.05, 4000, 0.06);
      return true;

    case 'tapping':
      for (let i = 0; i < 5; i += 1) noise(ctx, now + i * 0.28, 0.05, 2500, 0.25);
      return true;

    case 'bird':
      for (let i = 0; i < 4; i += 1) {
        tone(ctx, 'sine', 2400 + i * 120, 3400, now + i * 0.22, 0.12, 0.18);
      }
      return true;

    case 'roar':
      tone(ctx, 'sawtooth', 110, 55, now, 1.4, 0.28);
      noise(ctx, now, 1.4, 500, 0.14);
      return true;

    case 'applause':
      for (let i = 0; i < 40; i += 1) noise(ctx, now + Math.random() * 1.8, 0.04, 3500, 0.05);
      return true;

    case 'splash':
      noise(ctx, now, 0.5, 900, 0.25);
      tone(ctx, 'sine', 700, 180, now, 0.35, 0.12);
      return true;

    case 'beep':
      tone(ctx, 'square', 880, 880, now, 0.18, 0.15);
      return true;
  }
}
