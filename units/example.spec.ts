import { assert } from "chai";
import { create_engine, render_as_infix, render_as_sexpr } from "../index";

describe("example", function () {
    it("...", function () {
        const lines: string[] = [
            `1+1`
        ];
        const engine = create_engine();
        const { values } = engine.executeScript(lines.join('\n'));
        const $ = engine.$;
        assert.strictEqual(render_as_sexpr(values[0], $), "2");
        assert.strictEqual(render_as_infix(values[0], $), "2");
        engine.release();
    });
});
