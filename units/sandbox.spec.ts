
import { assert } from "chai";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/api";
import { SyntaxKind } from "../src/parser/parser";

describe("sandbox", function () {
    it("b*a", function () {
        const lines: string[] = [
            `b*a`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Eigenmath });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], {}), "a b");
        engine.release();
    });
});