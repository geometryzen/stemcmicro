import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";

describe("isprime", function () {
    it("isprime(0)", function () {
        const lines: string[] = [
            `isprime(0)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("isprime(1)", function () {
        const lines: string[] = [
            `isprime(1)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("isprime(2)", function () {
        const lines: string[] = [
            `isprime(2)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("isprime(3)", function () {
        const lines: string[] = [
            `isprime(3)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("isprime(4)", function () {
        const lines: string[] = [
            `isprime(4)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("isprime(5)", function () {
        const lines: string[] = [
            `isprime(5)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("isprime(9007199254740991)", function () {
        const lines: string[] = [
            `isprime(9007199254740991)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("isprime(2^53-111)", function () {
        const lines: string[] = [
            `isprime(2^53-111)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
});
