
import { assert } from "chai";
import { is_rat } from "math-expression-atoms";
import { U } from "math-expression-tree";
import { create_engine } from "../src/api/api";

describe("arctan", function () {
    xit("factor", function () {
        const lines: string[] = [
            `factor(27+27*x+9*x**2+x**3,x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine();
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
        // assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), '(x+3)**3');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
});