
import { assert } from "chai";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";

describe("sandbox", function () {
    xit("sqrt(49) using Python", function () {
        const lines: string[] = [
            `sqrt(49)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: false, usePython: true });
        const { trees, errors } = engine.parse(sourceText, {});
        if (errors.length > 0) {
            // console.lg(`${errors}`);
        }
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), "7");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), "7");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "7");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'LaTeX' }), "7");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "7");
        engine.release();
    });
    it("sqrt(49*m*m) using Eigenmath", function () {
        const lines: string[] = [
            `sqrt(49*m*m)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: false });
        const { trees, errors } = engine.parse(sourceText, {});
        if (errors.length > 0) {
            // console.lg(`${errors}`);
        }
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), "7 m");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), "7 m");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "7 m");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'LaTeX' }), "7 m");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "(* 7 m)");
        engine.release();
    });
});