import { run_test } from '../test-harness';

// ============================================================================
// Associativity for ADD operator
// ============================================================================
// ADD 01
run_test([
    'a + a + a',
    '3*a',

    'printlist',
    '(multiply 3 a)',
], {});
// ADD 02
run_test([
    'a + a + b',
    '2*a+b',

    'printlist',
    '(add (multiply 2 a) b)'
], {});
// ADD 03
run_test([
    'a + a + c',
    '2*a+c',

    'printlist',
    '(add (multiply 2 a) c)'
], {});
// ADD 04
run_test([
    'a + b + a',
    '2*a+b',

    'printlist',
    '(add (multiply 2 a) b)'
], {});
// ADD 05
run_test([
    'a + b + b',
    'a+2*b',

    'printlist',
    '(add a (multiply 2 b))'
], {});
// ADD 06
run_test([
    'a + b + c',
    'a+b+c',

    'printlist',
    '(add a b c)',
], {});
// ADD 07
run_test([
    'a + c + a',
    '2*a+c',

    'printlist',
    '(add (multiply 2 a) c)'
], {});
// ADD 08
run_test([
    'a + c + b',
    'a+b+c',

    'printlist',
    '(add a b c)'
], {});
// ADD 09
run_test([
    'a + c + c',
    'a+2*c',

    'printlist',
    '(add a (multiply 2 c))'
], {});
// ADD 10
run_test([
    'b + a + a',
    '2*a+b',

    'printlist',
    '(add (multiply 2 a) b)'
], {});
// ADD 11
run_test([
    'b + a + b',
    'a+2*b',

    'printlist',
    '(add a (multiply 2 b))'
], {});
// ADD 12
run_test([
    'b + a + c',
    'a+b+c',

    'printlist',
    '(add a b c)'
], {});
// ADD 13
run_test([
    'b + b + a',
    'a+2*b',

    'printlist',
    '(add a (multiply 2 b))'
], {});
// ADD 14
run_test([
    'b + b + b',
    '3*b',

    'printlist',
    '(multiply 3 b)'
], {});
// ADD 15
run_test([
    'b + b + c',
    '2*b+c',

    'printlist',
    '(add (multiply 2 b) c)'
], {});
// ADD 16
run_test([
    'b + c + a',
    'a+b+c',

    'printlist',
    '(add a b c)'
], {});
// ADD 17
run_test([
    'b + c + b',
    '2*b+c',

    'printlist',
    '(add (multiply 2 b) c)'
], {});
// ADD 18
run_test([
    'b + c + c',
    'b+2*c',

    'printlist',
    '(add b (multiply 2 c))'
], {});
// ADD 19
run_test([
    'c + a + a',
    '2*a+c',

    'printlist',
    '(add (multiply 2 a) c)'
], {});
// ADD 20
run_test([
    'c + a + b',
    'a+b+c',

    'printlist',
    '(add a b c)'
], {});
// ADD 21
run_test([
    'c + a + c',
    'a+2*c',

    'printlist',
    '(add a (multiply 2 c))'
], {});
// ADD 22
run_test([
    'c + b + a',
    'a+b+c',

    'printlist',
    '(add a b c)'
], {});
// ADD 23
run_test([
    'c + b + b',
    '2*b+c',

    'printlist',
    '(add (multiply 2 b) c)'
], {});
// ADD 24
run_test([
    'c + b + c',
    'b+2*c',

    'printlist',
    '(add b (multiply 2 c))'
], {});
// ADD 25
run_test([
    'c + c + a',
    'a+2*c',

    'printlist',
    '(add a (multiply 2 c))'
], {});
// ADD 26
run_test([
    'c + c + b',
    'b+2*c',

    'printlist',
    '(add b (multiply 2 c))'
], {});
// ADD 27
run_test([
    'c + c + c',
    '3*c',

    'printlist',
    '(multiply 3 c)'
], {});
