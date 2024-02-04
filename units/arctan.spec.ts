
import { assert } from "chai";
import { is_sym } from "math-expression-atoms";
import { U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/api";

describe("arctan", function () {
    it("sin(x)/cos(x)", function () {
        const lines: string[] = [
            `arctan(sin(x)/cos(x))`
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
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), 'x');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), 'x');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), 'x');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), 'x');
        assert.strictEqual(is_sym(values[0]), true);
        engine.release();
    });
});