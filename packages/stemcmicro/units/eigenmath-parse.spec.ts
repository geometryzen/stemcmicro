import assert from "assert";
import { stemcmicro_parse } from "../src/algebrite/em_parse";
import { create_script_context } from "../src/runtime/script_engine";

describe("eigenmath-parse", function () {
    it("f(x) = x", function () {
        const lines: string[] = [`f(x) = x`];

        const engine = create_script_context({});

        const { trees } = stemcmicro_parse(lines.join("\n"));
        assert.strictEqual(Array.isArray(trees), true);
        assert.strictEqual(trees.length, 1);
        const tree = trees[0];
        assert.strictEqual(engine.renderAsSExpr(tree), "(= (f x) x)");
        engine.release();
    });
});
