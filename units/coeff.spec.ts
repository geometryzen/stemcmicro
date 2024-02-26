import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";

describe("coeff", function () {
    it("coeff(40*x^3+30*x^2+20*x+10,3)", function () {
        const lines: string[] = [
            `coeff(40*x^3+30*x^2+20*x+10,3)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "40");
        assert.strictEqual(engine.renderAsInfix(values[0]), "40");
        engine.release();
    });
    it("coeff(40*x^3+30*x^2+20*x+10,2)", function () {
        const lines: string[] = [
            `coeff(40*x^3+30*x^2+20*x+10,2)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "30");
        assert.strictEqual(engine.renderAsInfix(values[0]), "30");
        engine.release();
    });
    it("coeff(40*x^3+30*x^2+20*x+10,1)", function () {
        const lines: string[] = [
            `coeff(40*x^3+30*x^2+20*x+10,1)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "20");
        assert.strictEqual(engine.renderAsInfix(values[0]), "20");
        engine.release();
    });
    it("coeff(40*x^3+30*x^2+20*x+10,0)", function () {
        const lines: string[] = [
            `coeff(40*x^3+30*x^2+20*x+10,0)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "10");
        assert.strictEqual(engine.renderAsInfix(values[0]), "10");
        engine.release();
    });
});
