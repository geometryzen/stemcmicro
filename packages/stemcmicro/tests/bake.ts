import { run_test, xrun_test } from "../test-harness";

xrun_test(
    [
        "bake = 0",
        "",

        "(x+3)**3",
        "27+27*x+9*x**2+x**3"

        //    'factor',
        //    '(3+x)**3',

        //    'bake = 1',
        //    '',

        // Why should bake change the ordering?
        //  '(x+3)^3',
        //  'x^3+9*x^2+27*x+27',

        //  'factor',
        //  '(x+3)^3',
    ],
    { useCaretForExponentiation: false }
);

run_test(
    [
        "bake = 0",
        "",

        "(x+3)^3",
        "27+27*x+9*x^2+x^3",

        "factor(27+27*x+9*x^2+x^3,x)",
        "(3+x)^3"

        //    'bake = 1',
        //    '',

        // Why should bake change the ordering?
        //  '(x+3)^3',
        //  'x^3+9*x^2+27*x+27',

        //  'factor',
        //  '(x+3)^3',
    ],
    { useCaretForExponentiation: true }
);
