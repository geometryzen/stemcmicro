import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("scalars", function () {
    it("", function () {
        const lines: string[] = [
            `a*b`,
        ];
        const engine = createScriptEngine();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a*b");
        engine.release();
    });
});
