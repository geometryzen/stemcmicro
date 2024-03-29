import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";

describe("shape", function () {
    it("shape([a,b,c])", function () {
        const lines: string[] = [
            `shape([a,b,c])`
        ];
        const engine = create_script_context({
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
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[1 3]");
        assert.strictEqual(engine.renderAsInfix(values[0]), "[1,3]");
        engine.release();
    });
    it("shape([[a],[b],[c]])", function () {
        const lines: string[] = [
            `shape([[a],[b],[c]])`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[3 1]");
        assert.strictEqual(engine.renderAsInfix(values[0]), "[3,1]");
        engine.release();
    });
});
