import { assert } from "chai";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("current", function () {
    it("5.0 + (-1 * 5.0)", function () {
        const lines: string[] = [
            `a = 5.0`,
            `a + (-1 * a)`
        ];
        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual($.toInfixString(value), "0.0");
        engine.release();
    });
});
