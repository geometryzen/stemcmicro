import { run_test } from '../test-harness';

run_test([
  'im(a+i*b)',
  'b',

  'im(1+exp(i*pi/3))',
  '1/2*3^(1/2)',

  'im(i)',
  '1',

  'im((-1)^(1/3))',
  '1/2*3^(1/2)',

  'im(-i)',
  '-1',
]);
