import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("zero", function () {
    it("zero(1,1)", function () {
        const lines: string[] = [
            `zero(1,1)`
        ];
        const engine = create_engine({
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
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[[0,0],[0,0]]");
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[0,0],[0,0]]");
        engine.release();
    });
});
