import { run_test } from '../test-harness';

// ============================================================================
// Associativity for MULTIPLY operator
// ============================================================================
run_test([
    'z * z * z',
    'z**3',

    'printlist',
    '(power z 3)',
]);

// MULTIPLY 01
run_test([
    'a * a * a',
    'a**3',

    'printlist',
    '(power a 3)',
]);
// MULTIPLY 02
run_test([
    'a * a * b',
    'a**2*b',

    'printlist',
    '(* (power a 2) b)'
]);
// MULTIPLY 03
run_test([
    'a * a * c',
    'a**2*c',

    'printlist',
    '(* (power a 2) c)'
]);
// MULTIPLY 04
run_test([
    'a * b * a',
    'a**2*b',

    'printlist',
    '(* (power a 2) b)'
], {});
// MULTIPLY 05
run_test([
    'a * b * b',
    'a*b**2',

    'printlist',
    '(* a (power b 2))'
]);
// MULTIPLY 06
run_test([
    'a * b * c',
    'a*b*c',

    'printlist',
    '(* a b c)',
]);
// MULTIPLY 07
run_test([
    'a * c * a',
    'a**2*c',

    'printlist',
    '(* (power a 2) c)'
], {});
// MULTIPLY 08
run_test([
    'a * c * b',
    'a*b*c',

    'printlist',
    '(* a b c)'
], {});
// MULTIPLY 09
run_test([
    'a * c * c',
    'a*c**2',

    'printlist',
    '(* a (power c 2))'
]);
// MULTIPLY 10
run_test([
    'b * a * a',
    'a**2*b',

    'printlist',
    '(* (power a 2) b)'
]);
// MULTIPLY 11
run_test([
    'b * a * b',
    'a*b**2',

    'printlist',
    '(* a (power b 2))'
], {});
// MULTIPLY 12
run_test([
    'b * a * c',
    'a*b*c',

    'printlist',
    '(* a b c)'
], {});
// MULTIPLY 13
run_test([
    'b * b * a',
    'a*b**2',

    'printlist',
    '(* a (power b 2))'
]);
// MULTIPLY 14
run_test([
    'b * b * b',
    'b**3',

    'printlist',
    '(power b 3)'
]);
// MULTIPLY 15
run_test([
    'b * b * c',
    'b**2*c',

    'printlist',
    '(* (power b 2) c)'
]);
// MULTIPLY 16
run_test([
    'b * c * a',
    'a*b*c',

    'printlist',
    '(* a b c)'
], {});
// MULTIPLY 17
run_test([
    'b * c * b',
    'b**2*c',

    'printlist',
    '(* (power b 2) c)'
], {});
// MULTIPLY 18
run_test([
    'b * c * c',
    'b*c**2',

    'printlist',
    '(* b (power c 2))'
]);
// POWER 19
run_test([
    'c * a * a',
    'a**2*c',

    'printlist',
    '(* (power a 2) c)'
]);
// MULTIPLY 20
run_test([
    'c * a * b',
    'a*b*c',

    'printlist',
    '(* a b c)'
], {});
// MULTIPLY 21
run_test([
    'c * a * c',
    'a*c**2',

    'printlist',
    '(* a (power c 2))'
], {});
// MULTIPLY 22
run_test([
    'c * b * a',
    'a*b*c',

    'printlist',
    '(* a b c)'
], {});
// MULTIPLY 23
run_test([
    'c * b * b',
    'b**2*c',

    'printlist',
    '(* (power b 2) c)'
]);
// MULTIPLY 24
run_test([
    'c * b * c',
    'b*c**2',

    'printlist',
    '(* b (power c 2))'
], {});
// MULTIPLY 25
run_test([
    'c * c * a',
    'a*c**2',

    'printlist',
    '(* a (power c 2))'
]);
// MULTIPLY 26
run_test([
    'c * c * b',
    'b*c**2',

    'printlist',
    '(* b (power c 2))'
]);
// ADD 27
run_test([
    'c * c * c',
    'c**3',

    'printlist',
    '(power c 3)'
]);