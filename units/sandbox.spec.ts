import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("derivative", function () {
    it("d(a,b)", function () {
        const lines: string[] = [
            `d(a,b)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(derivative a b)");
        assert.strictEqual(engine.renderAsInfix(actual), "d(a,b)");
        engine.release();
    });
});
