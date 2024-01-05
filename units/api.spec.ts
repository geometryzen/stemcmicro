
import { assert } from "chai";
import { create_engine, EngineConfig, ExprEngine, ParseConfig, RenderConfig } from "../src/api/index";

describe("api", function () {
    it("native A", function () {
        const lines: string[] = [
            `sqrt(x)`,
        ];
        const sourceText = lines.join('\n');
        const configEngine: EngineConfig = { useGeometricAlgebra: true };
        const engine: ExprEngine = create_engine(configEngine);
        const configParse: ParseConfig = { useGeometricAlgebra: true, useCaretForExponentiation: false, useParenForTensors: false };
        const { trees, errors } = engine.parse(sourceText, configParse);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            const configInfix: RenderConfig = { useCaretForExponentiation: true, useParenForTensors: true };
            assert.strictEqual(engine.renderAsString(value, configInfix), "x^(1/2)");
        }
        engine.release();
    });
    it("native B", function () {
        const lines: string[] = [
            `sqrt(x)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, { useGeometricAlgebra: true, useCaretForExponentiation: false, useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsString(value, { useCaretForExponentiation: false, useParenForTensors: true }), "x**(1/2)");
        }
        engine.release();
    });
    it("native C", function () {
        const lines: string[] = [
            `a**b`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, { useGeometricAlgebra: true, useCaretForExponentiation: false, useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsString(value, { useCaretForExponentiation: true, useParenForTensors: true }), "a^b");
        }
        engine.release();
    });
    // TODO: Need to respond to the error.
    xit("native D", function () {
        const lines: string[] = [
            `a**b`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, { useGeometricAlgebra: true, useCaretForExponentiation: true, useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsString(value, { useCaretForExponentiation: true, useParenForTensors: true }), "a^b");
        }
        engine.release();
    });
    it("eigenmath A", function () {
        const lines: string[] = [
            `sqrt(x)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: false });
        const { trees, errors } = engine.parse(sourceText, { useGeometricAlgebra: false, useCaretForExponentiation: false, useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsString(value, { useCaretForExponentiation: true, useParenForTensors: true }), "x^(1/2)");
        }
        engine.release();
    });
    it("eigenmath B", function () {
        const lines: string[] = [
            `sqrt(x)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: false });
        const { trees, errors } = engine.parse(sourceText, { useGeometricAlgebra: false, useCaretForExponentiation: false, useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsString(value, { useCaretForExponentiation: false, useParenForTensors: true }), "x**(1/2)");
        }
        engine.release();
    });
    it("eigenmath C", function () {
        const lines: string[] = [
            `a**b`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: false });
        const { trees, errors } = engine.parse(sourceText, { useGeometricAlgebra: false, useCaretForExponentiation: false, useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsString(value, { useCaretForExponentiation: false, useParenForTensors: true }), "a**b");
        }
        engine.release();
    });
    // TODO: This should be an error because caret is being used for exponentiation.
    it("eigenmath D", function () {
        const lines: string[] = [
            `a**b`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: false });
        const { trees, errors } = engine.parse(sourceText, { useGeometricAlgebra: false, useCaretForExponentiation: true, useParenForTensors: false });
        assert.strictEqual(errors.length, 1);
        assert.strictEqual(trees.length, 0);
        /*
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsInfix(value, { useCaretForExponentiation: true, useParenForTensors: true }), "a**b");
        }
        */
        engine.release();
    });
    it("mixed Eigenmath => Native", function () {
        const lines: string[] = [
            `x*x`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, { useGeometricAlgebra: false, useCaretForExponentiation: true, useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsString(value, { useCaretForExponentiation: true, useParenForTensors: false }), "x^2");
        }
        engine.release();
    });
    it("mixed Native => Eigenmath", function () {
        const lines: string[] = [
            `x*x`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: false });
        const { trees, errors } = engine.parse(sourceText, { useGeometricAlgebra: true, useCaretForExponentiation: true, useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsString(value, { useCaretForExponentiation: true, useParenForTensors: false }), "x^2");
        }
        engine.release();
    });
    it("sqrt(-1) mixed Native => Eigenmath", function () {
        const lines: string[] = [
            `sqrt(-1)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: false });
        const { trees, errors } = engine.parse(sourceText, { useGeometricAlgebra: true, useCaretForExponentiation: true, useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsString(value, { useCaretForExponentiation: true, useParenForTensors: false }), "i");
        }
        engine.release();
    });
    it("sqrt(-1) mixed Eigenmath => Native", function () {
        const lines: string[] = [
            `sqrt(-1)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, { useGeometricAlgebra: false, useCaretForExponentiation: true, useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsString(value, { useCaretForExponentiation: true, useParenForTensors: false }), "i");
        }
        engine.release();
    });
});