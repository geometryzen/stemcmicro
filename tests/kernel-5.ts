import { run_test, xrun_test } from '../test-harness';

// Determine whether we can recognize floating point types.
run_test([
    '0.0',
    '0.0'
]);

// Determine whether the system can recognize a universal mathematical function.
run_test([
    'exp(0)',
    '1',

    'exp(1)',
    'math.e',
], { verbose: true });

xrun_test([
    'exp(0)',
    '1',

    'float(exp(1))',
    '2.718282...'
]);

// Determine whether a function works using the plugin architecture and a Cons match.
xrun_test([
    'tau(0)',
    '0',

    'tau(1)',
    '2*pi',

    'float(tau(1)/2)',
    '3.141593...'
]);
