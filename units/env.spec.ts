import { assert } from "chai";
import { create_env } from "../src/env/env";
import { MATH_ADD, MATH_E, MATH_IMU, MATH_MUL, MATH_POW } from "../src/runtime/ns_math";
import { create_script_engine } from "../src/runtime/script_engine";

describe("env", function () {
    describe("constructor", function () {
        it("should be defined", function () {
            const $ = create_env();
            assert.isDefined($);
        });
    });
    describe("tokens", function () {
        it("exp(1) (default)", function () {
            const lines: string[] = [
                `exp(1)`
            ];
            const engine = create_script_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "e");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "e");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "e");
            engine.release();
        });
        it("exp(1) (override)", function () {
            const lines: string[] = [
                `exp(1)`
            ];
            const engine = create_script_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            engine.setSymbolToken(MATH_E, 'E');
            assert.strictEqual(engine.renderAsInfix(values[0]), "E");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "E");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "e");
            engine.release();
        });
        it("sqrt(-1) (default)", function () {
            const lines: string[] = [
                `sqrt(-1)`
            ];
            const engine = create_script_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "i");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "i");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "i");
            engine.release();
        });
        it("sqrt(-1) (override)", function () {
            const lines: string[] = [
                `sqrt(-1)`
            ];
            const engine = create_script_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            engine.setSymbolToken(MATH_IMU, 'I');
            assert.strictEqual(engine.renderAsInfix(values[0]), "I");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "I");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "i");
            engine.release();
        });
        it("a+b (default)", function () {
            const lines: string[] = [
                `a+b`
            ];
            const engine = create_script_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "a+b");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ a b)");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "a+b");
            engine.release();
        });
        it("a+b (override)", function () {
            const lines: string[] = [
                `a+b`
            ];
            const engine = create_script_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            engine.setSymbolToken(MATH_ADD, 'ADD');
            assert.strictEqual(engine.renderAsInfix(values[0]), "a+b");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "(ADD a b)");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "a+b");
            engine.release();
        });
        it("a*b (default)", function () {
            const lines: string[] = [
                `a*b`
            ];
            const engine = create_script_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "a*b");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "(* a b)");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "ab");
            engine.release();
        });
        it("a*b (override)", function () {
            const lines: string[] = [
                `a*b`
            ];
            const engine = create_script_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            engine.setSymbolToken(MATH_MUL, 'MUL');
            assert.strictEqual(engine.renderAsInfix(values[0]), "a*b");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "(MUL a b)");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "ab");
            engine.release();
        });
        it("a**b (default)", function () {
            const lines: string[] = [
                `a**b`
            ];
            const engine = create_script_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "a**b");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "(power a b)");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "a^b");
            engine.release();
        });
        it("a^b (default)", function () {
            const lines: string[] = [
                `a^b`
            ];
            const engine = create_script_engine({ useCaretForExponentiation: true });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "a^b");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "(power a b)");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "a^b");
            engine.release();
        });
        it("a**b (override)", function () {
            const lines: string[] = [
                `a**b`
            ];
            const engine = create_script_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            engine.setSymbolToken(MATH_POW, 'POW');
            assert.strictEqual(engine.renderAsInfix(values[0]), "a**b");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "(POW a b)");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "a^b");
            engine.release();
        });
    });
});
