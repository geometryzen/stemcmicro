import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("dim", function () {
    it("dim([[a]],1)", function () {
        const lines: string[] = [
            `dim([[a]],1)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("dim([[a,b],[c,d]],1)", function () {
        const lines: string[] = [
            `dim([[a,b],[c,d]],1)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "2");
        assert.strictEqual(engine.renderAsInfix(values[0]), "2");
        engine.release();
    });
});
