import { run_test } from '../test-harness';

// The purpose of this test is to determine whether the system is performing normalization of expressions.
// These tests can be run against version 1.0 to detect regressions.
//
// Guiding Principles:
//
// 0. Discover and ensure the normalized form of trees using printlist. 
// 1. Rat numbers are fundamental to expression normalization. These should be tested first.
// 2. Sym, Rat, and Cons are the fundamental building blocks. These should be tested next.
// 3. The system should not introduce Flt numbers. Even pi should be explicitly defined.
// 4. Ensure that the correct parts of the code are being exercised for fundamental operations.

// Rat
run_test([
    '0',
    '0',

    'printlist',
    '0',

    '1',
    '1',

    'printlist',
    '1',

    '1+1',
    '2',

    'printlist',
    '2',

    '-1',
    '-1',

    'printlist',
    '-1',

    '1*1',
    '1',

    '2*3',
    '6',

    'printlist',
    '6',

    '-1',
    '-1',

    'printlist',
    '-1'
], {});

run_test([
    '2*3',
    '6',
], {});

// Sym
run_test([
    'x',
    'x',

    'printlist',
    'x',
], {});

// TODO: Unicode symbols

// Rat * Sym
run_test([
    '-2*x',
    '-2*x',

    'printlist',
    '(* -2 x)',
], {});

// Rat * Sym
run_test([
    '-2*x',
    '-2*x',

    'printlist',
    '(* -2 x)',
], {});

// Sym * Rat
run_test([
    'x*(-2)',
    '-2*x',

    'printlist',
    '(* -2 x)',
], {});

// -Sym (Unary Minus)
run_test([
    '-x',
    '-x',

    'printlist',
    '(* -1 x)'
], {});

// In version 1.x, the caret (circumflex) symbol is used for exponentiation.
run_test([
    'a**2',
    'a**2',

    'printlist',
    '(power a 2)'
], {});

// Sym * Sym
run_test([
    'a*b',
    'a*b',

    'printlist',
    '(* a b)',

    'b*a',
    'b*a',

    // In version 1.x the symbols are allowed to commute.
    // They are ordered lexically.
    'printlist',
    '(* b a)',

    // In version 1.x, the caret (circumflex) symbol is used for exponentiation.
    'a*a',
    'a**2',

    'printlist',
    '(power a 2)',
], {});

// Sym + Sym
run_test([
    'a+b',
    'a+b',

    'printlist',
    '(+ a b)',

    'b+a',
    'a+b',

    'printlist',
    '(+ a b)',

    'c+c',
    '2*c',

    // Because addition of like symbols is represented by multiplication.
    // This suggests that symbol multiplication is more fundamental than symbol addition.
    'printlist',
    '(* 2 c)',

    'c-c',
    '0',

    'printlist',
    '0',
], {});
