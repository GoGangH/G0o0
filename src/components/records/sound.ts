// Every sound is synthesised, so there are no audio files to download or license.
// Browsers only allow audio after a user gesture, and everything here starts from one.

const STORAGE_KEY = "record-sound";
const CRACKLE_LEVEL = 0.05;

let context: AudioContext | null = null;
let master: GainNode | null = null;
let crackle: { source: AudioBufferSourceNode; gain: GainNode } | null = null;
let crackleBuffer: AudioBuffer | null = null;

export function soundEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {}
  if (!enabled) stopCrackle();
}

function audio() {
  if (!soundEnabled() || typeof window === "undefined") return null;
  if (!context) {
    context = new AudioContext();
    master = context.createGain();
    master.gain.value = 0.8;
    master.connect(context.destination);
  }
  if (context.state === "suspended") void context.resume();
  return context;
}

function noiseBuffer(ctx: AudioContext, seconds: number) {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

// A burst of filtered noise is what paper and card sound like.
function brush(ctx: AudioContext, { at = 0, length, from, to, level, q = 0.8 }: { at?: number; length: number; from: number; to: number; level: number; q?: number }) {
  const start = ctx.currentTime + at;
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx, length);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = q;
  filter.frequency.setValueAtTime(from, start);
  filter.frequency.exponentialRampToValueAtTime(to, start + length);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(level, start + length * 0.25);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  source.connect(filter).connect(gain).connect(master!);
  source.start(start);
}

function thump(ctx: AudioContext, { at = 0, from, to, length, level }: { at?: number; from: number; to: number; length: number; level: number }) {
  const start = ctx.currentTime + at;
  const oscillator = ctx.createOscillator();
  oscillator.frequency.setValueAtTime(from, start);
  oscillator.frequency.exponentialRampToValueAtTime(to, start + length);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(level, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  oscillator.connect(gain).connect(master!);
  oscillator.start(start);
  oscillator.stop(start + length);
}

/** A deck button going down. */
export function playClick() {
  const ctx = audio();
  if (!ctx) return;
  brush(ctx, { length: 0.025, from: 3400, to: 1800, level: 0.22, q: 1.2 });
  thump(ctx, { at: 0.006, from: 170, to: 80, length: 0.05, level: 0.18 });
}

/** The jacket turning over. */
export function playFlip() {
  const ctx = audio();
  if (ctx) brush(ctx, { length: 0.16, from: 1400, to: 3800, level: 0.24, q: 0.6 });
}

/** The record sliding out of its sleeve. */
export function playPull() {
  const ctx = audio();
  if (ctx) brush(ctx, { length: 0.3, from: 700, to: 2600, level: 0.3, q: 0.5 });
}

/** The record settling on the platter. */
export function playDrop() {
  const ctx = audio();
  if (!ctx) return;
  thump(ctx, { from: 120, to: 48, length: 0.16, level: 0.45 });
  brush(ctx, { length: 0.05, from: 2400, to: 900, level: 0.12 });
}

/** The stylus touching down: a soft tick and a low pop. */
export function playNeedle() {
  const ctx = audio();
  if (!ctx) return;
  brush(ctx, { length: 0.03, from: 5200, to: 3000, level: 0.2, q: 1.4 });
  thump(ctx, { at: 0.012, from: 90, to: 40, length: 0.1, level: 0.3 });
}

function makeCrackle(ctx: AudioContext) {
  const seconds = 6;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let low = 0;
  for (let i = 0; i < data.length; i++) {
    // Soft surface hiss, low-passed so it stays warm.
    low += (Math.random() * 2 - 1 - low) * 0.12;
    data[i] = low * 0.16;
  }
  for (let pops = seconds * 14, n = 0; n < pops; n++) {
    const at = Math.floor(Math.random() * (data.length - 400));
    const size = Math.random() < 0.12 ? 0.9 : 0.15 + Math.random() * 0.35;
    const length = 40 + Math.floor(Math.random() * 220);
    for (let i = 0; i < length; i++) data[at + i] += size * (Math.random() * 2 - 1) * Math.exp((-i / length) * 5);
  }
  return buffer;
}

/** Surface noise while a record is on. It loops until stopCrackle. */
export function startCrackle() {
  const ctx = audio();
  if (!ctx || crackle) return;
  crackleBuffer ??= makeCrackle(ctx);
  const source = ctx.createBufferSource();
  source.buffer = crackleBuffer;
  source.loop = true;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(CRACKLE_LEVEL, ctx.currentTime + 0.5);
  source.connect(gain).connect(master!);
  source.start();
  crackle = { source, gain };
}

export function stopCrackle(fade = 0.25) {
  if (!crackle || !context) return;
  const { source, gain } = crackle;
  crackle = null;
  gain.gain.cancelScheduledValues(context.currentTime);
  gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + fade);
  source.stop(context.currentTime + fade + 0.02);
}
