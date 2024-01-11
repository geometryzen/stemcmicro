
import { assert } from "chai";
import { is_rat, is_uom } from "math-expression-atoms";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";

describe("sandbox", function () {
    it("second", function () {
        const lines: string[] = [
            `second=uom("second")`,
            `second`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), "s");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), "s");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "s");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'LaTeX' }), "s");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "s");
        engine.release();
    });
    it("dimensionless Uom", function () {
        const lines: string[] = [
            `second=uom("second")`,
            `second/second`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), "1");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), "1");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "1");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'LaTeX' }), "1");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "1");
        engine.release();
    });
    it("dimensionless Uom should be converted to Rat(1)", function () {
        const lines: string[] = [
            `second=uom("second")`,
            `second/second`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "1");
        assert.strictEqual(is_rat(values[0]), true);
        assert.strictEqual(is_uom(values[0]), false);
        engine.release();
    });
});