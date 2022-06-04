import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../index";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("mul", function () {
    it("(x*x)/x", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `(x*x)/x`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "x");
        assert.strictEqual(render_as_infix(actual, $), "x");

        engine.release();
    });
});
