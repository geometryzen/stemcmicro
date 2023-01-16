import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";

describe("arctanh", function () {
    it("arctanh(0)", function () {
        const lines: string[] = [
            `arctanh(0)`
        ];
        const engine = createScriptEngine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
});
