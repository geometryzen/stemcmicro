import { run_test } from "../test-harness";

run_test(["re(a)", "a"], {
    assumes: {
        a: { real: true }
    }
});

run_test(["re(a)", "re(a)"], {
    assumes: {
        a: { real: false }
    }
});
