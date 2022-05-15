import { assert } from "chai";
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
        assert.strictEqual($.toListString(actual), '5');
        assert.strictEqual($.toInfixString(actual), '5');
        engine.release();
    });
});
