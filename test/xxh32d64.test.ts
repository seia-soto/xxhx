import test from 'ava';
import fc from 'fast-check';
import XXH from 'xxhashjs';
import { Buffer } from 'node:buffer';

import {
  XXH32D64_SEED_HIGH,
  XXH32D64_SEED_LOW,
  xxh32d64,
} from '../src/xxh32d64.js';

test('xxh32d64 matches two xxhashjs h32 passes', (t) => {
  fc.assert(
    fc.property(
      fc.uint8Array({ minLength: 0, maxLength: 1024 }),
      (bytes) => {
        const buffer = Buffer.from(bytes);
        const high =
          XXH.h32(buffer, XXH32D64_SEED_HIGH).toNumber() >>> 0;
        const low =
          XXH.h32(buffer, XXH32D64_SEED_LOW).toNumber() >>> 0;
        const expected = (BigInt(high) << 32n) | BigInt(low);

        t.is(
          xxh32d64(bytes, 0, bytes.length),
          expected,
          `Uint8Array<${bytes.toString()}>`,
        );
      },
    ),
    {
      numRuns: 10_000,
      seed: 0x87654321,
    },
  );
});

test('xxh32d64 respects beg and end offsets', (t) => {
  fc.assert(
    fc.property(
      fc.uint8Array({ minLength: 1, maxLength: 1024 }),
      fc.nat(1023),
      fc.nat(1023),
      (bytes, begCandidate, endCandidate) => {
        const beg = begCandidate % bytes.length;
        const end = beg + (endCandidate % (bytes.length - beg));
        const slice = bytes.subarray(beg, end);

        t.is(
          xxh32d64(bytes, beg, end),
          xxh32d64(slice, 0, slice.length),
        );
      },
    ),
    {
      numRuns: 10_000,
      seed: 0x12348765,
    },
  );
});
