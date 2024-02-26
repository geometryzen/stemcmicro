import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";

describe("gamma", function () {
    it("gamma(x+1)", function () {
        const lines: string[] = [
            `gamma(x+1)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* x (gamma x))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "x*gamma(x)");
        engine.release();
    });
    it("gamma(1/2)", function () {
        const lines: string[] = [
            `gamma(1/2)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(pow pi 1/2)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "pi**(1/2)");
        engine.release();
    });
});
