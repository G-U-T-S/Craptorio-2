// const defaultAmplitude = 1.0;
// const defaultFrequency = 0.4;
// const defaultOctaves = 2;
// const defaultPersistence = 0.5;
const NORM_2D = 1.0 / 50.0;
const SQUISH_2D = (Math.sqrt(2 + 1) - 1) / 2;
const STRETCH_2D = (1 / Math.sqrt(2 + 1) - 1) / 2;
const base2D = [
  [1, 1, 0, 1, 0, 1, 0, 0, 0],
  [1, 1, 0, 1, 0, 1, 2, 1, 1],
];
const gradients2D = [
  5, 2, 2, 5, -5, 2, -2, 5,
  5, -2, 2, -5, -5, -2, -2, -5,
];
const lookupPairs2D = [
  0, 1, 1, 0, 4, 1,
  17, 0, 20, 2, 21,
  2, 22, 5, 23, 5, 26,
  4, 39, 3, 42, 4, 43, 3,
];
const p2D = [
  0, 0, 1, -1, 0, 0,
  -1, 1, 0, 2, 1, 1, 1,
  2, 2, 0, 1, 2, 0, 2,
  1, 0, 0, 0,
];

type Noise2DFn = (x: number, y: number) => number;
/*
interface Options {
  amplitude: number;
  frequency: number;
  octaves: number;
  persistence: number;
  scale?: (x: number) => number;
}
*/
interface Contribution2D {
  dx: number; dy: number;
  xsb: number; ysb: number;
  next?: Contribution2D;
}

function contribution2D( multiplier: number, xsb: number, ysb: number): Contribution2D {
  return {
    dx: -xsb - multiplier * SQUISH_2D,
    dy: -ysb - multiplier * SQUISH_2D,
    xsb, ysb
  };
}

function shuffleSeed(seed: Uint32Array): Uint32Array {
  const newSeed = new Uint32Array(1);
  newSeed[0] = seed[0] * 1664525 + 1013904223;
  return newSeed;
}

function simplexNoise2D(clientSeed: number): Noise2DFn {
  const contributions: Contribution2D[] = [];
  
  for (let i = 0; i < p2D.length; i += 4) {
    const baseSet = base2D[p2D[i]];
    let previous: Contribution2D | null = null;
    let current: Contribution2D | null = null;
    
    for (let k = 0; k < baseSet.length; k += 3) {
      current = contribution2D(baseSet[k], baseSet[k + 1], baseSet[k + 2]);
      if (previous === null) contributions[i / 4] = current;
      else previous.next = current;
      previous = current;
    }
    current!.next = contribution2D(p2D[i + 1], p2D[i + 2], p2D[i + 3]);
  }
  
  const lookup: Contribution2D[] = [];
  
  for (let i = 0; i < lookupPairs2D.length; i += 2) {
    lookup[lookupPairs2D[i]] = contributions[lookupPairs2D[i + 1]];
  }

  const perm = new Uint8Array(256);
  const perm2D = new Uint8Array(256);
  const source = new Uint8Array(256);
  
  for (let i = 0; i < 256; i++) {
    source[i] = i;
  }
  
  let seed = new Uint32Array(1);
  seed[0] = clientSeed;
  seed = shuffleSeed(shuffleSeed(shuffleSeed(seed)));
  
  for (let i = 255; i >= 0; i--) {
    seed = shuffleSeed(seed);
    const r = new Uint32Array(1);
    r[0] = (seed[0] + 31) % (i + 1);
    
    if (r[0] < 0) {
      r[0] += i + 1;
    }
    
    perm[i] = source[r[0]];
    perm2D[i] = perm[i] & 0x0e;
    source[r[0]] = source[i];
  }

  return (x: number, y: number): number => {
    const stretchOffset = (x + y) * STRETCH_2D;

    const xs = x + stretchOffset;
    const ys = y + stretchOffset;

    const xsb = Math.floor(xs);
    const ysb = Math.floor(ys);

    const squishOffset = (xsb + ysb) * SQUISH_2D;

    const dx0 = x - (xsb + squishOffset);
    const dy0 = y - (ysb + squishOffset);

    const xins = xs - xsb;
    const yins = ys - ysb;

    const inSum = xins + yins;
    const hash = (xins - yins + 1) |
      (inSum << 1) |
      ((inSum + yins) << 2) |
      ((inSum + xins) << 4);

    let value = 0;

    for (
      let c: Contribution2D | undefined = lookup[hash];
      c !== undefined;
      c = c.next
    ) {
      const dx = dx0 + c.dx;
      const dy = dy0 + c.dy;

      const attn = 2 - dx * dx - dy * dy;
      if (attn > 0) {
        const px = xsb + c.xsb;
        const py = ysb + c.ysb;

        const indexPartA = perm[px & 0xff];
        const index = perm2D[(indexPartA + py) & 0xff];

        const valuePart = gradients2D[index] * dx + gradients2D[index + 1] * dy;

        value += attn * attn * attn * attn * valuePart;
      }
    }

    return value * NORM_2D;
  };
}

/*
export function createRectangleNoise(
  seed: number,
  width: number,
  height: number,
  // noise2: Noise2DFn,
  {
    amplitude = defaultAmplitude,
    frequency = defaultFrequency,
    octaves = defaultOctaves,
    persistence = defaultPersistence,
    scale,
  }: Partial<Options> = {},
): number[][] {
  const field: number[][] = new Array(width);
  const noise2 = simplexNoise2D(seed);

  for (let x = 0; x < width; x++) {
    field[x] = new Array(height);
    for (let y = 0; y < height; y++) {
      let value = 0.0;
      for (let octave = 0; octave < octaves; octave++) {
        const freq = frequency * Math.pow(2, octave);
        value += noise2(x * freq, y * freq) *
          (amplitude * Math.pow(persistence, octave));
      }
      field[x][y] = value / (2 - 1 / Math.pow(2, octaves - 1));
      if (scale) field[x][y] = scale(field[x][y]);
    }
  }
  return field;
}
*/

export class FractalNoise2D {
  private noise: Noise2DFn;
  private octaves: number;
  private frequency: number;
  private amplitude: number
  private persistence: number

  constructor(seed: number, octaves: number, frequency: number, amplitude: number, persistence: number) {
    this.noise = simplexNoise2D(seed);
    this.octaves = octaves;
    this.frequency = frequency;
    this.amplitude = amplitude;
    this.persistence = persistence;
  }

  public get(x: number, y: number): number {
    let value = 0.0;

    for (let octave = 0; octave < this.octaves; octave++) {
      const freq = this.frequency * Math.pow(2, octave);
      value += this.noise(x * freq, y * freq) * (this.amplitude * Math.pow(this.persistence, octave));
    }
   
    value = value / (2 - 1 / Math.pow(2, this.octaves - 1));
    value *= -1;

    return value;
  }
}

export class SimplexNoise2D {
  private noise: Noise2DFn;

  constructor(seed: number) {
    this.noise = simplexNoise2D(seed);
  }

  get(x: number, y: number): number {
    return this.noise(x, y);
  }
}