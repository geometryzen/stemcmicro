import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("legendre", function () {
    it("legendre(x,0)", function () {
        const lines: string[] = [
            `legendre(x,0)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("legendre(x,1)", function () {
        const lines: string[] = [
            `legendre(x,1)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "x");
        assert.strictEqual(engine.renderAsInfix(values[0]), "x");
        engine.release();
    });
});
