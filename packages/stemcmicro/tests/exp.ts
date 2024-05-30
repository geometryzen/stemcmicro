import { run_test } from "../test-harness";

run_test(["exp(-3/4*i*pi)", "-1/2*2**(1/2)-1/2*2**(1/2)*i", "simplify(exp(-3/4*i*pi))", "-1/2*2**(1/2)*(1+i)"]);
