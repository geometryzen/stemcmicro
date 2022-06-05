import { run_test } from "../test-harness";

// Sym * Rat
run_test([
    'x*(-2)',
    '-2*x',

    'print',
    '-2*x',

    'printcomputer',
    '-2*x',

    'printlatex',
    '-2x',

    'printlist',
    '(* -2 x)',

    'printhuman',
    '-2 x',

    'print2dascii',
    '-2 x',

    // One more just to make sure that all of the keywords return script.last rather than NIL.
    'print',
    '-2 x',
], {});
