
import { assert } from "chai";
import { create_engine, ExprEngine, parse } from "../src/api/index";

describe("sandbox", function () {
    it("sqrt(-1) mixed Native => Eigenmath", function () {
        const lines: string[] = [
            `sqrt(-1)`,
        ];
        const sourceText = lines.join('\n');
        const { trees, errors } = parse(sourceText, { useGeometricAlgebra: true, useCaretForExponentiation: true, useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: false });
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
        const { trees, errors } = parse(sourceText, { useGeometricAlgebra: false, useCaretForExponentiation: true, useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsString(value, { useCaretForExponentiation: true, useParenForTensors: false }), "i");
        }
        engine.release();
    });
});