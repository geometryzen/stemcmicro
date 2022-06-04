import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../index";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("imu", function () {
    it("((-2.0*(-1)**(1/2))*2.0)*(-1)**(1/2)", function () {
        const lines: string[] = [
            `implicate=0`,
            `((-2.0*(-1)**(1/2))*2.0)*(-1)**(1/2)`
        ];
        const engine = create_engine({
            dependencies: ['Flt', 'Imu']
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "4.0");
        assert.strictEqual(render_as_infix(actual, $), "4.0");

        engine.release();
    });
});
