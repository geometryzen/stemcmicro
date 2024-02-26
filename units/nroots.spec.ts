import assert from 'assert';
import { stemc_prolog } from "../src/runtime/init";
import { create_script_context } from "../src/runtime/script_engine";

describe("nroots", function () {
    xit("nroots(x)", function () {
        const lines: string[] = [
            `nroots(x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    xit("nroots(x-1)", function () {
        const lines: string[] = [
            `nroots(x-1)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(engine.renderAsInfix(values[0]), "1.0");
        engine.release();
    });
    xit("nroots(x+1)", function () {
        const lines: string[] = [
            `nroots(x+1)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(engine.renderAsInfix(values[0]), "-1.0");
        engine.release();
    });
    xit("nroots(x**2-1)", function () {
        const lines: string[] = [
            `nroots(x**2-1)`
        ];
        const engine = create_script_context({
            prolog: stemc_prolog
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[-1.000000...,1.000000...]");
        engine.release();
    });
    xit("nroots(x**2+1)", function () {
        const lines: string[] = [
            `nroots(x**2+1)`
        ];
        const engine = create_script_context({
            prolog: stemc_prolog
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[-1.000000...*i,1.000000...*i]");
        engine.release();
    });
    it("nroots((1+i)*x**2+1)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `nroots((1+i)*x**2+1)`
        ];
        const engine = create_script_context({
            prolog: stemc_prolog
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[-0.321797...-0.776887...*i,0.321797...+0.776887...*i]");
        engine.release();
    });
    xit("nroots(sqrt(2)*exp(i*pi/4)*x^2+1)", function () {
        const lines: string[] = [
            `nroots(sqrt(2)*exp(i*pi/4)*x^2+1)`
        ];
        const engine = create_script_context({
            prolog: stemc_prolog,
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[-0.171780...-0.727673...*i,0.171780...+0.727673...*i]");
        engine.release();
    });
    it("nroots(x^2+1)", function () {
        const lines: string[] = [
            `nroots(x^2+1)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[-1.000000...*i,1.000000...*i]");
        engine.release();
    });
    // The sort of the resuting roots is not stable.
    it("nroots(x^4+1)", function () {
        const lines: string[] = [
            `nroots(x^4+1)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[-0.707107...-0.707107...*i,-0.707107...+0.707107...*i,0.707107...+0.707107...*i,0.707107...-0.707107...*i]");
        engine.release();
    });
});
