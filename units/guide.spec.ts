import { assert } from "chai";
import { create_engine, render_as_infix, render_as_sexpr, transform } from "../index";
import { scan_source_text } from "../src/scanner/scan_source_text";

describe("guide", function () {
    it("...", function () {
        const lines: string[] = [
            `cos(x)`
        ];
        const engine = create_engine();
        const $ = engine.$;

        const { trees, errors } = scan_source_text(lines.join('\n'));
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(errors.length, 0);

        const tree = trees[0];

        assert.strictEqual(render_as_sexpr(tree, $), "(cos x)");
        assert.strictEqual(render_as_infix(tree, $), "cos(x)");

        const value = transform(tree, $);

        assert.strictEqual(render_as_sexpr(value, $), "(cos x)");
        assert.strictEqual(render_as_infix(value, $), "cos(x)");
        engine.release();
    });
});
