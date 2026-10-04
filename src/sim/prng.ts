// ============================================================================
// SEEDED PSEUDO-RANDOM NUMBER GENERATOR (Mulberry32)
// Ensures deterministic, reproducible simulation runs across reloads
// ============================================================================

export class SeededPRNG {
  private s: number;

  constructor(seed: number = 422026) {
    this.s = seed >>> 0;
  }

  public reset(seed: number = 422026): void {
    this.s = seed >>> 0;
  }

  // Returns pseudo-random float in [0, 1)
  public next(): number {
    let t = (this.s += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Returns float in [min, max)
  public nextRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Returns integer in [min, max]
  public nextInt(min: number, max: number): number {
    return Math.floor(this.nextRange(min, max + 1));
  }

  // Returns normal distributed variable (Box-Muller)
  public nextGaussian(mean: number = 0, stdDev: number = 1): number {
    const u1 = Math.max(1e-10, this.next());
    const u2 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  }
}

export const globalPRNG = new SeededPRNG(422026);
