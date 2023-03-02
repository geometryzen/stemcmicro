import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("nroots", function () {
    it("nroots(x)", function () {
        const lines: string[] = [
            `nroots(x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_engine({
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(engine.renderAsInfix(values[0]), "0.0");
        engine.release();
    });
    it("nroots(x-1)", function () {
        const lines: string[] = [
            `nroots(x-1)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_engine({
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(engine.renderAsInfix(values[0]), "1.0");
        engine.release();
    });
    it("nroots(x+1)", function () {
        const lines: string[] = [
            `nroots(x+1)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_engine({
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(engine.renderAsInfix(values[0]), "-1.0");
        engine.release();
    });
    it("nroots((1+i)*x^2+1)", function () {
        const lines: string[] = [
            `nroots((1+i)*x^2+1)`
        ];
        const engine = create_script_engine({
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[-0.171780...-0.727673...*i,0.171780...+0.727673...*i]");
        engine.release();
    });
    it("nroots(sqrt(2)*exp(i*pi/4)*x^2+1)", function () {
        const lines: string[] = [
            `nroots(sqrt(2)*exp(i*pi/4)*x^2+1)`
        ];
        const engine = create_script_engine({
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[-0.171780...-0.727673...*i,0.171780...+0.727673...*i]");
        engine.release();
    });
    it("nroots(x^2+1)", function () {
        const lines: string[] = [
            `nroots(x^2+1)`
        ];
        const engine = create_script_engine({
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[-1.000000...*i,1.000000...*i]");
        engine.release();
    });
    // The sort of the resuting roots is not stable.
    xit("nroots(x^4+1)", function () {
        const lines: string[] = [
            `nroots(x^4+1)`
        ];
        const engine = create_script_engine({
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[-0.707107...-0.707107...*i,-0.707107...+0.707107...*i,0.707107...+0.707107...*i,0.707107...-0.707107...*i]");
        engine.release();
    });
});
