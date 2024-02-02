
import { assert } from "chai";
import { stemc_parse } from "../src/algebrite/stemc_parse";
import { create_script_context } from "../src/runtime/script_engine";

describe("eigenmath-parse", function () {
    it("f(x) = x", function () {
        const lines: string[] = [
            `f(x) = x`
        ];

        const engine = create_script_context({});

        const { trees } = stemc_parse(lines.join('\n'));
        assert.isArray(trees);
        assert.strictEqual(trees.length, 1);
        const tree = trees[0];
        assert.isDefined(tree);
        assert.strictEqual(engine.renderAsSExpr(tree), "(= (f x) x)");
        engine.release();
    });
});
