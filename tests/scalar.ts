import { run_test } from '../test-harness';

run_test([
  'uom("meter")',
  'm',

  'uom("second")',
  's',

  'kg = uom("kilogram")',
  '',

  'm = uom("meter")',
  '',

  'kg * m',
  'kg m',

  'm * kg',
  'kg m',

  'a * b',
  'a*b',

  // In version 2.x, symbols are not allowed to commute.
  // But we are allowing it to happen to check backwards compatibility.
  'b * a',
  'a*b',
]);
