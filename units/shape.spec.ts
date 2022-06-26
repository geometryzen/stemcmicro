import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("shape", function () {
    it("shape([a,b,c])", function () {
        const lines: string[] = [
            `shape([a,b,c])`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[3]");
        assert.strictEqual(engine.renderAsInfix(values[0]), "[3]");
        engine.release();
    });
    it("shape([[a,b,c]])", function () {
        const lines: string[] = [
            `shape([[a,b,c]])`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[1,3]");
        assert.strictEqual(engine.renderAsInfix(values[0]), "[1,3]");
        engine.release();
    });
    it("shape([[a],[b],[c]])", function () {
        const lines: string[] = [
            `shape([[a],[b],[c]])`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[3,1]");
        assert.strictEqual(engine.renderAsInfix(values[0]), "[3,1]");
        engine.release();
    });
});
