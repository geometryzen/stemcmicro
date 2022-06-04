import { assert } from "chai";
import { render_as_infix } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("rect", function () {
    it("exp(i*pi/3)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `rect(exp(i*pi/3))`,
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        // assert.strictEqual(print_expr(value, $), "cos(1/3*π)+sin(1/3*π)*i");
        // The following is what you get wuthout applying (rect ...)
        assert.strictEqual(render_as_infix(value, $), "1/2+(1/2*3**(1/2))*i");
        engine.release();
    });
});
