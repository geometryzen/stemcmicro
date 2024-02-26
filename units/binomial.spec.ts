import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";

describe("binomial", function () {
    it("binomial(12,6)", function () {
        const lines: string[] = [
            `binomial(12,6)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "924");
        assert.strictEqual(engine.renderAsInfix(values[0]), "924");
        engine.release();
    });
    it("binomial(n,k)", function () {
        const lines: string[] = [
            `binomial(n,k)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "n!/(k!*(-k+n)!)");
        engine.release();
    });
    it("binomial(0,k)", function () {
        const lines: string[] = [
            `binomial(0,k)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* (pow (factorial k) -1) (pow (factorial (* -1 k)) -1))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/(k!*(-k)!)");
        engine.release();
    });
    // TODO: Detect the pattern for cancellation.
    xit("binomial(n,0)", function () {
        const lines: string[] = [
            `binomial(n,0)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* (factorial n) (pow (factorial n) -1))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
});
