import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { VERSION_LATEST } from "../src/runtime/version";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("scriptlast", function () {
    it("", function () {
        const lines: string[] = [
            `5`
        ];
        const engine = createSymEngine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '5');
        assert.strictEqual(print_expr(actual, $), '5');
        engine.release();
    });
});
