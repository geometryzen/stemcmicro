import { run_test } from '../test-harness';

run_test([
    'iszero(1)',
    'false',

    'iszero(0)',
    'true',

    'iszero(1.0)',
    'false',

    'iszero(0.0)',
    'true',

    'iszero([1])',
    'false',

    'iszero([0])',
    'true',

    'iszero([1.0])',
    'false',

    'iszero([0.0])',
    'true',
], { useIntegersForPredicates: false });

run_test([
    'iszero(1)',
    '0',

    'iszero(0)',
    '1',

    'iszero(1.0)',
    '0',

    'iszero(0.0)',
    '1',

    'iszero([1])',
    '0',

    'iszero([0])',
    '1',

    'iszero([1.0])',
    '0',

    'iszero([0.0])',
    '1',
], { useIntegersForPredicates: true });
