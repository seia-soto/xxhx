/**
xxHash32 implementation in pure Javascript

Copyright (C) 2013, Pierre Curto
MIT license
*/

const PRIME32_1 = 0x9e3779b1;
const PRIME32_2 = 0x85ebca77;
const PRIME32_3 = 0xc2b2ae3d;
const PRIME32_4 = 0x27d4eb2f;
const PRIME32_5 = 0x165667b1;

export const SEED = 0x9e3779b1 | 0;

export function xxh32(
  input: Uint8Array,
  beg: number,
  end: number,
): number {
  beg >>>= 0;
  end >>>= 0;

  const len = end - beg;
  const end4 = end - 4;
  let p = beg;
  let h32: number;

  if (len >= 16) {
    const limit16 = end - 16;
    let v1 = SEED + PRIME32_1 + PRIME32_2;
    let v2 = SEED + PRIME32_2;
    let v3 = SEED;
    let v4 = SEED - PRIME32_1;
    let lane: number;

    while (p <= limit16) {
      lane =
        input[p]! |
        (input[p + 1]! << 8) |
        (input[p + 2]! << 16) |
        (input[p + 3]! << 24);
      v1 += Math.imul(lane, PRIME32_2);
      v1 = Math.imul((v1 << 13) | (v1 >>> 19), PRIME32_1);
      lane =
        input[p + 4]! |
        (input[p + 5]! << 8) |
        (input[p + 6]! << 16) |
        (input[p + 7]! << 24);
      v2 += Math.imul(lane, PRIME32_2);
      v2 = Math.imul((v2 << 13) | (v2 >>> 19), PRIME32_1);
      lane =
        input[p + 8]! |
        (input[p + 9]! << 8) |
        (input[p + 10]! << 16) |
        (input[p + 11]! << 24);
      v3 += Math.imul(lane, PRIME32_2);
      v3 = Math.imul((v3 << 13) | (v3 >>> 19), PRIME32_1);
      lane =
        input[p + 12]! |
        (input[p + 13]! << 8) |
        (input[p + 14]! << 16) |
        (input[p + 15]! << 24);
      v4 += Math.imul(lane, PRIME32_2);
      v4 = Math.imul((v4 << 13) | (v4 >>> 19), PRIME32_1);
      p += 16;
    }

    h32 =
      ((v1 << 1) | (v1 >>> 31)) +
      ((v2 << 7) | (v2 >>> 25)) +
      ((v3 << 12) | (v3 >>> 20)) +
      ((v4 << 18) | (v4 >>> 14));
  } else {
    h32 = SEED + PRIME32_5;
  }

  h32 += len;

  while (p <= end4) {
    h32 += Math.imul(
      input[p]! |
        (input[p + 1]! << 8) |
        (input[p + 2]! << 16) |
        (input[p + 3]! << 24),
      PRIME32_3,
    );
    h32 = Math.imul((h32 << 17) | (h32 >>> 15), PRIME32_4);
    p += 4;
  }

  while (p < end) {
    h32 += Math.imul(input[p++]!, PRIME32_5);
    h32 = Math.imul((h32 << 11) | (h32 >>> 21), PRIME32_1);
  }

  h32 ^= h32 >>> 15;
  h32 = Math.imul(h32, PRIME32_2);
  h32 ^= h32 >>> 13;
  h32 = Math.imul(h32, PRIME32_3);
  h32 ^= h32 >>> 16;

  return h32 >>> 0;
}
