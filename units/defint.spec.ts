import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("defint", function () {
    it("defint(x^2,y,0,sqrt(1-x^2),x,-1,1)", function () {
        const lines: string[] = [
            `defint(x^2,y,0,sqrt(1-x^2),x,-1,1)`
        ];
        const engine = createSymEngine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(* 1/8 π)");
        assert.strictEqual(print_expr(actual, $), "1/8*π");

        engine.release();
    });
});
