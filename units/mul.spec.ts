import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("mul", function () {
    it("(x*x)/x", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `(x*x)/x`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "x");
        assert.strictEqual(print_expr(actual, $), "x");

        engine.release();
    });
});
