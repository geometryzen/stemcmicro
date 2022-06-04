import { assert } from "chai";
import { create_engine, render_as_infix, render_as_latex, render_as_sexpr } from "../index";

describe("example", function () {
    it("...", function () {
        const lines: string[] = [
            `a/b`
        ];
        const engine = create_engine();
        const { values } = engine.executeScript(lines.join('\n'));
        const $ = engine.$;
        assert.strictEqual(render_as_infix(values[0], $), "a/b");
        assert.strictEqual(render_as_sexpr(values[0], $), "(* a (power b -1))");
        assert.strictEqual(render_as_latex(values[0], $), "\\frac{a}{b}");
        engine.release();
    });
});
