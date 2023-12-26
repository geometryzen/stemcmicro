
import { assert } from "chai";
import { eigenmath_parse } from "../src/brite/eigenmath_parse";
import { create_script_context } from "../src/runtime/script_engine";

describe("eigenmath-parse", function () {
    it("f(x) = x", function () {
        const lines: string[] = [
            `f(x) = x`
        ];

        const engine = create_script_context({});

        const { trees } = eigenmath_parse('foo.ts', lines.join('\n'));
        assert.isArray(trees);
        assert.strictEqual(trees.length, 1);
        const tree = trees[0];
        assert.isDefined(tree);
        assert.strictEqual(engine.renderAsSExpr(tree), "(= (f x) x)");
        engine.release();
    });
});
