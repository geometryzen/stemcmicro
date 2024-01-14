
import { assert } from "chai";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";

describe("ClojureScript", function () {
    it("Numbers", function () {
        const lines: string[] = [
            `32`,
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
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "32");
        engine.release();
    });
});