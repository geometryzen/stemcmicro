import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("simplify", function () {
    it("simplify(exp(-3/4*i*pi))", function () {
        const lines: string[] = [
            `simplify(exp(-3/4*i*pi))`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(power e (* -3/4 i pi))");
        assert.strictEqual(print_expr(actual, $), "e**(-3/4*i*pi)");

        engine.release();
    });
});
