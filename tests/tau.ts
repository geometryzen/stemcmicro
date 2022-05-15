import { run_test } from '../test-harness';

run_test([
    'tau(1)',
    '2*π',
], { verbose: true });

run_test([
    'tau(1)/2',
    'π'
], { verbose: true });

run_test([
    'float(tau(1)/2)',
    'π'
], { verbose: true });