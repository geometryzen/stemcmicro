import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("tan", function () {
    it("tan(x)", function () {
        const lines: string[] = [
            `tan(x)`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(tan x)");
        assert.strictEqual(print_expr(actual, $), "tan(x)");

        engine.release();
    });
});
