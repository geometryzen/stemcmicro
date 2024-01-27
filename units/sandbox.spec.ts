
import { assert } from "chai";
import { is_blade } from "math-expression-atoms";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";
import { SyntaxKind } from "../src/parser/parser";

describe("ClojureScript", function () {
    it("algebra", function () {
        const lines: string[] = [
            `(= G30 (algebra [1 1 1] ["i" "j" "k"]))`,
            `(= e1 (component G30 1))`,
            `(= e2 (component G30 2))`,
            `(= e3 (component G30 3))`,
            `e1`,
            `e2`,
            `e3`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 3);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "i");
        assert.strictEqual(is_blade(values[0]), true);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), "j");
        assert.strictEqual(is_blade(values[1]), true);
        assert.strictEqual(engine.renderAsString(values[2], { format: 'Infix' }), "k");
        assert.strictEqual(is_blade(values[2]), true);
        engine.release();
    });
});