import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("current", function () {
    it("(c/x+b)+(-c)/x", function () {
        const lines: string[] = [
            `implicate=0`,
            `(c/x+b)+(-c)/x`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "b");
        assert.strictEqual(print_expr(actual, $), "b");

        engine.release();
    });
    it("(b+c/x)+(-c)/x", function () {
        const lines: string[] = [
            `implicate=0`,
            `(b+c/x)+(-c)/x`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "b");
        assert.strictEqual(print_expr(actual, $), "b");

        engine.release();
    });
});
