import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("integral", function () {
    it("integral(x)", function () {
        const lines: string[] = [
            `integral(x*x,x)`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(* 1/3 (power x 3))");
        assert.strictEqual(print_expr(actual, $), "1/3*x**3");

        engine.release();
    });
});
