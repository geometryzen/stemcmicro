
import { assert } from "chai";
import { is_tensor } from "math-expression-atoms";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";

describe("sandbox", function () {
    it("Tensors in Eigenmath", function () {
        const lines: string[] = [
            `["Alice", "Bob", "Carol"]`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `["Alice","Bob","Carol"]`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `["Alice" "Bob" "Carol"]`);
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("Vectors in ClojureScript", function () {
        const lines: string[] = [
            `["Alice" "Bob" "Carol"]`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useClojureScript: true });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `["Alice","Bob","Carol"]`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `["Alice" "Bob" "Carol"]`);
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
});