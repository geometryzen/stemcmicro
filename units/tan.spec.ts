import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../index";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("tan", function () {
    it("tan(x)", function () {
        const lines: string[] = [
            `tan(x)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(tan x)");
        assert.strictEqual(render_as_infix(actual, $), "tan(x)");

        engine.release();
    });
});
