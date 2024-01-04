
import { assert } from "chai";
import { create_engine, ExprEngine, parse } from "../src/api/index";

describe("sandbox", function () {
    it("mixed Native => Eigenmath", function () {
        const lines: string[] = [
            `x*x`,
        ];
        const sourceText = lines.join('\n');
        const { trees, errors } = parse(sourceText, { useGeometricAlgebra: true, useCaretForExponentiation: true, useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: false });
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            assert.strictEqual(engine.renderAsInfix(value, { useCaretForExponentiation: true, useParenForTensors: false }), "x^2");
        }
        engine.release();
    });
});