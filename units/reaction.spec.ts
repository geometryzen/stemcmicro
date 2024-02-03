
import { assert } from "chai";
import { is_rat } from "math-expression-atoms";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/api";
import { SyntaxKind } from "../src/parser/parser";


describe("reaction", function () {
    it("101", function () {
        const lines: string[] = [
            `(def a-cell (atom 2))`,
            `(def b-cell (atom 3))`,
            `(def c-cell (reaction (+ (deref a-cell) (deref b-cell))))`,
            `(reset! a-cell 5)`,
            `(reset! b-cell 7)`,
            `(deref c-cell)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 6);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '12');
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
});