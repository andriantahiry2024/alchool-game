/**
 * Web Audio API synth sound manager.
 * Synthesizes retro game effects on the fly without needing large static assets.
 */

let audioCtx: AudioContext | null = null;

/**
 * Initializes the AudioContext lazily on user gesture to comply with browser autoplay policies.
 *
 * @returns The AudioContext instance or null if not supported.
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a quick, crisp button click sound.
 */
export function playClick(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
}

/**
 * Plays a winning arpeggio effect (C major chord progression).
 */
export function playSuccess(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
  const duration = 0.1;
  const gap = 0.08;

  notes.forEach((freq, index) => {
    const time = ctx.currentTime + index * gap;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.15, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    osc.start(time);
    osc.stop(time + duration);
  });
}

/**
 * Plays a descending sad buzzer fail sound.
 */
export function playFail(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.4);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

/**
 * Simulates a dice rolling sound effect by generating a sequence of rapid short clicks.
 *
 * @param durationMs - Duration of the rolling sound in milliseconds.
 */
export function playDiceRoll(durationMs: number = 1000): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const steps = 12;
  const interval = durationMs / steps;

  for (let i = 0; i < steps; i++) {
    const time = ctx.currentTime + (i * interval) / 1000;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    // Frequency increases slightly for each click to simulate tension
    osc.frequency.setValueAtTime(100 + i * 30, time);

    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.start(time);
    osc.stop(time + 0.05);
  }
}

/**
 * Plays a clicking sound for a spinning wheel or bottle.
 * Usually called repeatedly as the rotation angle changes.
 */
export function playSpinTick(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, ctx.currentTime);

  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.02);
}
