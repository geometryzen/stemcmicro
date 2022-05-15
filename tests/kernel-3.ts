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
], { version: 1 });
// ADD 02
run_test([
    'a + a + b',
    '2*a+b',

    'printlist',
    '(add (multiply 2 a) b)'
], { version: 1 });
// ADD 03
run_test([
    'a + a + c',
    '2*a+c',

    'printlist',
    '(add (multiply 2 a) c)'
], { version: 1 });
// ADD 04
run_test([
    'a + b + a',
    '2*a+b',

    'printlist',
    '(add (multiply 2 a) b)'
], { version: 1 });
// ADD 05
run_test([
    'a + b + b',
    'a+2*b',

    'printlist',
    '(add a (multiply 2 b))'
], { version: 1 });
// ADD 06
run_test([
    'a + b + c',
    'a+b+c',

    'printlist',
    '(add a b c)',
], { version: 1 });
// ADD 07
run_test([
    'a + c + a',
    '2*a+c',

    'printlist',
    '(add (multiply 2 a) c)'
], { version: 1 });
// ADD 08
run_test([
    'a + c + b',
    'a+b+c',

    'printlist',
    '(add a b c)'
], { version: 1 });
// ADD 09
run_test([
    'a + c + c',
    'a+2*c',

    'printlist',
    '(add a (multiply 2 c))'
], { version: 1 });
// ADD 10
run_test([
    'b + a + a',
    '2*a+b',

    'printlist',
    '(add (multiply 2 a) b)'
], { version: 1 });
// ADD 11
run_test([
    'b + a + b',
    'a+2*b',

    'printlist',
    '(add a (multiply 2 b))'
], { version: 1 });
// ADD 12
run_test([
    'b + a + c',
    'a+b+c',

    'printlist',
    '(add a b c)'
], { version: 1 });
// ADD 13
run_test([
    'b + b + a',
    'a+2*b',

    'printlist',
    '(add a (multiply 2 b))'
], { version: 1 });
// ADD 14
run_test([
    'b + b + b',
    '3*b',

    'printlist',
    '(multiply 3 b)'
], { version: 1 });
// ADD 15
run_test([
    'b + b + c',
    '2*b+c',

    'printlist',
    '(add (multiply 2 b) c)'
], { version: 1 });
// ADD 16
run_test([
    'b + c + a',
    'a+b+c',

    'printlist',
    '(add a b c)'
], { version: 1 });
// ADD 17
run_test([
    'b + c + b',
    '2*b+c',

    'printlist',
    '(add (multiply 2 b) c)'
], { version: 1 });
// ADD 18
run_test([
    'b + c + c',
    'b+2*c',

    'printlist',
    '(add b (multiply 2 c))'
], { version: 1 });
// ADD 19
run_test([
    'c + a + a',
    '2*a+c',

    'printlist',
    '(add (multiply 2 a) c)'
], { version: 1 });
// ADD 20
run_test([
    'c + a + b',
    'a+b+c',

    'printlist',
    '(add a b c)'
], { version: 1 });
// ADD 21
run_test([
    'c + a + c',
    'a+2*c',

    'printlist',
    '(add a (multiply 2 c))'
], { version: 1 });
// ADD 22
run_test([
    'c + b + a',
    'a+b+c',

    'printlist',
    '(add a b c)'
], { version: 1 });
// ADD 23
run_test([
    'c + b + b',
    '2*b+c',

    'printlist',
    '(add (multiply 2 b) c)'
], { version: 1 });
// ADD 24
run_test([
    'c + b + c',
    'b+2*c',

    'printlist',
    '(add b (multiply 2 c))'
], { version: 1 });
// ADD 25
run_test([
    'c + c + a',
    'a+2*c',

    'printlist',
    '(add a (multiply 2 c))'
], { version: 1 });
// ADD 26
run_test([
    'c + c + b',
    'b+2*c',

    'printlist',
    '(add b (multiply 2 c))'
], { version: 1 });
// ADD 27
run_test([
    'c + c + c',
    '3*c',

    'printlist',
    '(multiply 3 c)'
], { version: 1 });
