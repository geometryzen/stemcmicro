import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("numerator", function () {
    xit("numerator(2/3)", function () {
        const lines: string[] = [
            `numerator(2/3)`
        ];
        const engine = createSymEngine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "2");
        assert.strictEqual(print_expr(actual, $), "2");

        engine.release();
    });
    xit("numerator(x)", function () {
        const lines: string[] = [
            `numerator(x)`
        ];
        const engine = createSymEngine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "x");
        assert.strictEqual(print_expr(actual, $), "x");

        engine.release();
    });
    xit("numerator(1/x)", function () {
        const lines: string[] = [
            `numerator(1/x)`
        ];
        const engine = createSymEngine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "1");
        assert.strictEqual(print_expr(actual, $), "1");

        engine.release();
    });
    xit("numerator(a+b)", function () {
        const lines: string[] = [
            `numerator(a+b)`
        ];
        const engine = createSymEngine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(+ a b)");
        assert.strictEqual(print_expr(actual, $), "a+b");

        engine.release();
    });
    xit("numerator(1/(1/a)", function () {
        const lines: string[] = [
            `numerator(1/(1/a))`
        ];
        const engine = createSymEngine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "a");
        assert.strictEqual(print_expr(actual, $), "a");

        engine.release();
    });
    it("numerator(1/a+1/b)", function () {
        const lines: string[] = [
            `numerator(1/a+1/b)`
        ];
        const engine = createSymEngine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(+ a b)");
        assert.strictEqual(print_expr(actual, $), "a+b");

        engine.release();
    });
});
