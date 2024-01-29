
import { assert } from "chai";
import { is_cons, is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";
import { SyntaxKind } from "../src/parser/parser";

describe("sandbox", function () {
    it("Enchilada", function () {
        const lines: string[] = [
            `(let [num (parseInt (.. e -target -value))] (reset! cell num))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), `(let [num parseInt(..(e,-target,-value))] (reset! cell num))`);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "(reset! cell num)");
        assert.strictEqual(is_cons(values[0]), true);
        engine.release();
    });
});