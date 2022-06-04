import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("integral", function () {
    it("integral(x)", function () {
        const lines: string[] = [
            `integral(x*x,x)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(* 1/3 (power x 3))");
        assert.strictEqual(render_as_infix(actual, $), "1/3*x**3");

        engine.release();
    });
});
