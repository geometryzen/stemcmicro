import { run_test } from '../test-harness';

run_test([
    'tau(1)',
    '2*pi',
], { verbose: true });

run_test([
    'tau(1)/2',
    'pi'
], { verbose: true });

run_test([
    'float(tau(1)/2)',
    '3.141593...'
], { verbose: true });