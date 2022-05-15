import { VERSION_NEXT } from '../src/runtime/version';
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

], { version: VERSION_NEXT });

run_test([
    'succ(succ(succ(5)))',
    '8'
], { version: VERSION_NEXT });

run_test([
    'pred(pred(pred(9)))',
    '6'
], { version: VERSION_NEXT });

run_test([
    'iszero(0)',
    'true',

    'iszero(1)',
    'false',

    'iszero(pred(succ(0)))',
    'true'

], { version: VERSION_NEXT });
