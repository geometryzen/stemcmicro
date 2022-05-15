import { run_test, xrun_test } from "../test-harness";

run_test([
    'a+b',
    'a+b',
], { version: 3 });

xrun_test([
    'x*(-2)',
    '-2*x',
], { version: 3 });
