import { assert } from "chai";
import { render_as_infix } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("arg", function () {
    it("arg(exp(i*pi/3))", function () {
        const lines: string[] = [
            `implicate=0`,
            `arg(exp(i*pi/3))`,
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_infix(value, $), "1/3*π");
        engine.release();
    });
});
