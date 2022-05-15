import { assert } from "chai";
import { createSymEngine } from "../src/runtime/symengine";
import { VERSION_LATEST } from "../src/runtime/version";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sqrt", function () {
    it("(a) should be converted to a power expression", function () {
        const lines: string[] = [
            `sqrt(a)`
        ];
        const engine = createSymEngine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual($.toListString(actual), '(power a 1/2)');
        assert.strictEqual($.toInfixString(actual), 'a**(1/2)');
        engine.release();
    });
});
