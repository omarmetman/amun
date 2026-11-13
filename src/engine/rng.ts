/**
 * Deterministic pseudo-random generator.
 * The same seed + the same sequence of draws always produces the same mission,
 * which is the contract behind "same seed, same design, same result".
 */

export interface RNG {
  next: () => number;
  int: (minInclusive: number, maxInclusive: number) => number;
  chance: (probability: number) => boolean;
  pick: <T>(items: T[]) => T;
  seed: number;
}

/** FNV-1a style hash, stable across browsers. */
export function hashSeed(seed: string | number): number {
  const text = String(seed);
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Mulberry32: tiny, fast, good enough for a game simulation. */
export function createRng(seed: string | number): RNG {
  let state = hashSeed(seed) || 0x9e3779b9;
  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    seed: hashSeed(seed),
    next,
    int: (minInclusive, maxInclusive) =>
      Math.floor(next() * (maxInclusive - minInclusive + 1)) + minInclusive,
    chance: (probability) => next() < Math.max(0, Math.min(1, probability)),
    pick: <T,>(items: T[]): T => items[Math.floor(next() * items.length)],
  };
}

/** A short, human-friendly seed that is easy to re-enter. */
export function makeSeed(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}
