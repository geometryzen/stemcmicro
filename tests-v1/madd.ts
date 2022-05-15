import { mint } from '../src/bignum';
import { madd, msub } from '../src/madd';
import { test } from '../test-harness';

let i = 0;
test('madd', t => {
  for (i = -100; i < 100; i++) {
    for (let j = -100; j < 100; j++) {
      const a = mint(i);
      const b = mint(j);
      const c = mint(i + j);
      t.is(c.toString(), madd(a, b).toString(), `${i}+${j}=${i + j}`);
    }
  }
});

test('msub', t => {
  for (i = -100; i <= 100; i++) {
    for (let j = -100; j <= 100; j++) {
      const a = mint(i);
      const b = mint(j);
      const c = mint(i - j);
      t.is(c.toString(), msub(a, b).toString(), `${i}-${j}=${i - j}`);
    }
  }
});
