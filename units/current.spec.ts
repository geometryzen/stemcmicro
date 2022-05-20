import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("current", function () {
    it("a*b*c", function () {
        const lines: string[] = [
            `a*b*c`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(* a b c)");
        assert.strictEqual(print_expr(actual, $), "a*b*c");

        engine.release();
    });
});
