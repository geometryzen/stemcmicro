import { run_test } from '../test-harness';

run_test([
    're(a)',
    'a'
], {
    assumes: {
        'a': { real: true }
    },
    useDefinitions: false
});

run_test([
    're(a)',
    're(a)'
], {
    assumes: {
        'a': { real: false }
    },
    useDefinitions: false
});
