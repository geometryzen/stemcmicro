import { assert } from "chai";
import { is_rat } from "math-expression-atoms";
import { U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/api";
import { create_script_context } from "../src/runtime/script_engine";

describe("blade", function () {
    describe("abs", function () {
        it("Euclidean metric", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1], ["i", "j"])`,
                `e1 = G11[1]`,
                `e2 = G11[2]`,
                `abs(e1)`
            ];
            const engine = create_script_context({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "1");
            engine.release();
        });
    });
    it("(e1+e2)**2", function () {
        const lines: string[] = [
            `(e1+e2)**2`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({});
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
});
