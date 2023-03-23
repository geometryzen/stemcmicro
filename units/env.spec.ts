import { assert } from "chai";
import { create_env } from "../src/env/env";
import { create_script_context } from "../src/runtime/script_engine";

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
            const engine = create_script_context();
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "e");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "e");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "e");
            engine.release();
        });
        it("sqrt(-1) (default)", function () {
            const lines: string[] = [
                `sqrt(-1)`
            ];
            const engine = create_script_context();
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "i");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "i");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "i");
            engine.release();
        });
        it("a+b (default)", function () {
            const lines: string[] = [
                `a+b`
            ];
            const engine = create_script_context();
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "a+b");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ a b)");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "a+b");
            engine.release();
        });
        it("a*b (default)", function () {
            const lines: string[] = [
                `a*b`
            ];
            const engine = create_script_context();
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "a*b");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "(* a b)");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "ab");
            engine.release();
        });
        it("a**b (default)", function () {
            const lines: string[] = [
                `a**b`
            ];
            const engine = create_script_context();
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "a**b");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "(pow a b)");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "a^b");
            engine.release();
        });
        it("a^b (default)", function () {
            const lines: string[] = [
                `a^b`
            ];
            const engine = create_script_context({ useCaretForExponentiation: true });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "a^b");
            assert.strictEqual(engine.renderAsSExpr(values[0]), "(pow a b)");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "a^b");
            engine.release();
        });
    });
});
