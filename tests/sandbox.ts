import { run_test } from '../test-harness';

run_test([
    'real(a)',
    'a'
], {
    assumes: {
        'a': { real: true }
    },
    useDefinitions: false
});

run_test([
    'real(a)',
    'real(a)'
], {
    assumes: {
        'a': { real: false }
    },
    useDefinitions: false
});
