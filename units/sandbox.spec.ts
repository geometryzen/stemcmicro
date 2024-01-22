
import { assert } from "chai";
import { is_boo } from "math-expression-atoms";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";
import { SyntaxKind } from "../src/parser/parser";

describe("ClojureScript", function () {
    it("Boo", function () {
        const lines: string[] = [
            `true`,
            `false`
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
        assert.strictEqual(values.length, 2);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `true`);
        assert.strictEqual(is_boo(values[0]), true);
        const I0 = values[0];
        if (is_boo(I0)) {
            assert.strictEqual(I0.end, 4, "end");
            assert.strictEqual(I0.pos, 0, "pos");
        }
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), `false`);
        assert.strictEqual(is_boo(values[1]), true);
        const I1 = values[1];
        if (is_boo(I1)) {
            assert.strictEqual(I1.end, 10, "end");
            assert.strictEqual(I1.pos, 5, "pos");
        }
        engine.release();
    });
});