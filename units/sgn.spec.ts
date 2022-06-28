import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("sgn", function () {
    it("sgn(-3)", function () {
        const lines: string[] = [
            `sgn(-3)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "-1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "-1");
        engine.release();
    });
    it("sgn(0)", function () {
        const lines: string[] = [
            `sgn(0)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("sgn(3)", function () {
        const lines: string[] = [
            `sgn(3)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
});
