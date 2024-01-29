
import { assert } from "chai";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";
import { is_rat } from "../src/operators/rat/rat_extension";
import { SyntaxKind } from "../src/parser/parser";

describe("sandbox", function () {
    it("defn", function () {
        const lines: string[] = [
            `(defn foo [x] (* 2 x))`,
            `(foo 7)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), `(defn foo [x] (* 2 x))`);
        assert.strictEqual(engine.renderAsString(trees[1], { format: 'SExpr' }), `(foo 7)`);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "14");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
});