
import { assert } from "chai";
import { assert_sym } from "math-expression-atoms";
import { create_engine, ExprEngine } from "../src/api/index";
import { SyntaxKind } from "../src/parser/parser";
import { assert_cons } from "../src/tree/cons/assert_cons";

describe("dom", function () {
    it("ClojureScript", function () {
        const lines: string[] = [
            `(dom/get-element-by-id "stdout")`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { trees, errors } = engine.parse(sourceText, {});
            assert.strictEqual(errors.length, 0);
            assert.strictEqual(trees.length, 1);
            const tree0 = assert_cons(trees[0]);
            const opr = assert_sym(tree0.opr);
            assert.strictEqual(opr.localName, "get-element-by-id");
            assert.strictEqual(opr.namespace, "dom");
            assert.strictEqual(opr.key(), "dom/get-element-by-id");
        }
        finally {
            engine.release();
        }
    });
});