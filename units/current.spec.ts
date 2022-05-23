import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("current", function () {
    it("(a**(-1))**(-1)", function () {
        const lines: string[] = [
            `(a**(-1))**(-1)`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "a");
        assert.strictEqual(print_expr(actual, $), "a");

        engine.release();
    });
    it("((a+b)**(-1))**(-1)", function () {
        const lines: string[] = [
            `((a+b)**(-1))**(-1)`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(+ a b)");
        assert.strictEqual(print_expr(actual, $), "a+b");

        engine.release();
    });
    it("((a*b)**(-1))**(-1)", function () {
        const lines: string[] = [
            `((a*b)**(-1))**(-1)`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(* a b)");
        assert.strictEqual(print_expr(actual, $), "a*b");

        engine.release();
    });
});
