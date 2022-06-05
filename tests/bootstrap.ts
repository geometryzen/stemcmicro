import { run_test } from '../test-harness';

run_test([
    'true',
    'true',

    'false',
    'false',

    'if(true, 2, 3)',
    '2',

    'if(false, 2, 3)',
    '3',

    'if(false, 0, 1)',
    '1',

    '0',
    '0',

    'succ(0)',
    '1',

    'succ(1)',
    '2',

], {});

run_test([
    'succ(succ(succ(5)))',
    '8'
], {});

run_test([
    'pred(pred(pred(9)))',
    '6'
], {});

run_test([
    'iszero(0)',
    'true',

    'iszero(1)',
    'false',

    'iszero(pred(succ(0)))',
    'true'

], {});
