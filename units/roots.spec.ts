import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("roots", function () {
    xit("roots(a*x**2+b*x+c)", function () {
        const lines: string[] = [
            `roots(a*x**2+b*x+c)`
        ];
        const engine = createSymEngine({ useCaretForExponentiation: false });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(+ a b)");
        assert.strictEqual(print_expr(actual, $), "a+b");
        engine.release();
    });
    xit("roots(a*x^2+b*x+c)", function () {
        const lines: string[] = [
            `roots(a*x^2+b*x+c)`
        ];
        const engine = createSymEngine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(+ a b)");
        assert.strictEqual(print_expr(actual, $), "a+b");
        engine.release();
    });
});
