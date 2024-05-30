import { run_test } from "../test-harness";

run_test(["re(a+i*b)", "a", "re(1+exp(i*pi/3))", "3/2", "re(i)", "0", "re((-1)^(1/3))", "1/2"]);
