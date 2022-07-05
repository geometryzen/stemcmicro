import { mint } from '../src/bignum';
import { mprime } from '../src/operators/isprime/mprime';
import { primetab } from '../src/runtime/constants';
import { test } from '../test-harness';

let i = 0;
let k = 0;
// const m = 0;
// const t = 0;
k = 0;
for (i = 0; i < 10000; i++) {
  const n = mint(i);
  const expectPrime = i === primetab[k];
  if (expectPrime) {
    k++;
  }
  test(`mprime(${i}) = ${expectPrime}`, t => t.is(expectPrime, mprime(n)));
}

//endif
