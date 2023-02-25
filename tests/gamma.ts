import { run_test } from '../test-harness';

run_test([
  'gamma(a)',
  'gamma(a)',

  //  "float(gamma(10))",
  //  "362880",

  'gamma(x+1)',
  'x*gamma(x)',

  'gamma(1/2)',
  'pi^(1/2)',

  'gamma(x-1)-gamma(x)/(-1+x)',
  '0',

  'gamma(-x)',
  '-pi/(x*gamma(x)*sin(pi*x))',
]);
