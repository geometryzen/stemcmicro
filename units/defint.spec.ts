import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("defint", function () {
    it("defint(x^2,y,0,sqrt(1-x^2),x,-1,1)", function () {
        const lines: string[] = [
            `defint(x^2,y,0,sqrt(1-x^2),x,-1,1)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(* 1/8 π)");
        assert.strictEqual(render_as_infix(actual, $), "1/8*π");

        engine.release();
    });
});
