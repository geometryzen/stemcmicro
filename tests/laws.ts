import { run_test } from "../test-harness";

// distributive law for +,*
run_test([
    'a*(b1+b2+b3)',
    'a*b1+a*b2+a*b3',
], {});
