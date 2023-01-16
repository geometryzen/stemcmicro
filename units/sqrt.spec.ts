import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sqrt", function () {
    it("(a) should be converted to a power expression", function () {
        const lines: string[] = [
            `sqrt(a)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '(power a 1/2)');
        assert.strictEqual(engine.renderAsInfix(actual), 'a**(1/2)');
        engine.release();
    });
});
