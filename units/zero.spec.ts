import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";

describe("zero", function () {
    it("zero(1,1)", function () {
        const lines: string[] = [
            `zero(1,1)`
        ];
        const engine = createScriptEngine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[[0]]");
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[0]]");
        engine.release();
    });
    it("zero(2,2)", function () {
        const lines: string[] = [
            `zero(2,2)`
        ];
        const engine = createScriptEngine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[[0,0],[0,0]]");
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[0,0],[0,0]]");
        engine.release();
    });
});
