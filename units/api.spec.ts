
import { assert } from "chai";
import { create_engine, EvalConfig, ExprEngine, parse, ParseConfig } from "../src/api/index";

describe("api", function () {
    it("native A", function () {
        const lines: string[] = [
            `sqrt(x)`,
        ];
        const sourceText = lines.join('\n');
        const configParse: ParseConfig = { useGeometricAlgebra: true, useCaretForExponentiation: false, useParenForTensors: false };
        const { trees, errors } = parse(sourceText, configParse);
        assert.strictEqual(errors.length, 0);
        const configEval: EvalConfig = { useGeometricAlgebra: true };
        const engine: ExprEngine = create_engine(configEval);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsInfix(value, { useCaretForExponentiation: true, useParenForTensors: true }), "x^(1/2)");
        }
        engine.release();
    });
    it("native B", function () {
        const lines: string[] = [
            `sqrt(x)`,
        ];
        const sourceText = lines.join('\n');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { trees, errors } = parse(sourceText, { useGeometricAlgebra: true, useCaretForExponentiation: false, useParenForTensors: false });
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsInfix(value, { useCaretForExponentiation: false, useParenForTensors: true }), "x**(1/2)");
        }
        engine.release();
    });
    it("native C", function () {
        const lines: string[] = [
            `a**b`,
        ];
        const sourceText = lines.join('\n');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { trees, errors } = parse(sourceText, { useGeometricAlgebra: true, useCaretForExponentiation: false, useParenForTensors: false });
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsInfix(value, { useCaretForExponentiation: true, useParenForTensors: true }), "a^b");
        }
        engine.release();
    });
    // TODO: Need to respond to the error.
    xit("native D", function () {
        const lines: string[] = [
            `a**b`,
        ];
        const sourceText = lines.join('\n');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { trees, errors } = parse(sourceText, { useGeometricAlgebra: true, useCaretForExponentiation: true, useParenForTensors: false });
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsInfix(value, { useCaretForExponentiation: true, useParenForTensors: true }), "a^b");
        }
        engine.release();
    });
    it("eigenmath A", function () {
        const lines: string[] = [
            `sqrt(x)`,
        ];
        const sourceText = lines.join('\n');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { trees, errors } = parse(sourceText, { useGeometricAlgebra: false, useCaretForExponentiation: false, useParenForTensors: false });
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: false });
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsInfix(value, { useCaretForExponentiation: true, useParenForTensors: true }), "x^(1/2)");
        }
        engine.release();
    });
    it("eigenmath B", function () {
        const lines: string[] = [
            `sqrt(x)`,
        ];
        const sourceText = lines.join('\n');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { trees, errors } = parse(sourceText, { useGeometricAlgebra: false, useCaretForExponentiation: false, useParenForTensors: false });
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: false });
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsInfix(value, { useCaretForExponentiation: false, useParenForTensors: true }), "x**(1/2)");
        }
        engine.release();
    });
    it("eigenmath C", function () {
        const lines: string[] = [
            `a**b`,
        ];
        const sourceText = lines.join('\n');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { trees, errors } = parse(sourceText, { useGeometricAlgebra: false, useCaretForExponentiation: false, useParenForTensors: false });
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: false });
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsInfix(value, { useCaretForExponentiation: false, useParenForTensors: true }), "a**b");
        }
        engine.release();
    });
    // TODO: This should be an error because caret is being used for exponentiation.
    it("eigenmath D", function () {
        const lines: string[] = [
            `a**b`,
        ];
        const sourceText = lines.join('\n');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { trees, errors } = parse(sourceText, { useGeometricAlgebra: false, useCaretForExponentiation: true, useParenForTensors: false });
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: false });
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsInfix(value, { useCaretForExponentiation: true, useParenForTensors: true }), "a**b");
        }
        engine.release();
    });
});