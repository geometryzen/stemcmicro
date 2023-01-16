import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("scriptlast", function () {
    it("", function () {
        const lines: string[] = [
            `5`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '5');
        assert.strictEqual(engine.renderAsInfix(actual), '5');
        engine.release();
    });
});
