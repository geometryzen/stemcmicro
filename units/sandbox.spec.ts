
import { assert } from "chai";
import { is_rat } from "math-expression-atoms";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";
import { SyntaxKind } from "../src/parser/parser";

describe("sandbox", function () {
    it("fn [x] ...", function () {
        const lines: string[] = [
            `(def triple (fn [x] (* 3 x)))`,
            `(triple 7)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), `(def triple (fn [x] (* 3 x)))`);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'Infix' }), `def(triple,fn [x] -> 3*x)`);
        assert.strictEqual(engine.renderAsString(trees[1], { format: 'SExpr' }), `(triple 7)`);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "21");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("fn [x y] ...", function () {
        const lines: string[] = [
            `(def area (fn [x y] (* x y)))`,
            `(area 3 5)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), `(def area (fn [x y] (* x y)))`);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'Infix' }), `def(area,fn [x y] -> x*y)`);
        assert.strictEqual(engine.renderAsString(trees[1], { format: 'SExpr' }), `(area 3 5)`);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "15");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
});