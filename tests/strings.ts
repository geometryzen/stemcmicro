import { run_test } from '../test-harness';

run_test([
    '"hey" + "you"',
    '"hey"+"you"',

    '"hey" + "hey"',
    '2*"hey"',

    '"hey" / "hey"',
    '1',

    '"hey" - "hey"',
    '0',

    '"hey" * "hey"',
    '"hey"^2',

    // 'a\nb' is a legal JavaScript string but it is not parsable JSON
    // JSON.stringify('a\nb') gives the parseable representation which is '"a\\nb"'. Notice the escaping.
    // JSON.parse('"a\nb"') gives SyntaxError: Bad control character in string literal in JSON at position 2 (line 1 column 3)
    `"a\\nb"`,
    `"a\\nb"`,
], { useCaretForExponentiation: true });
