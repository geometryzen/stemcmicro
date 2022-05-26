import { assert } from "chai";
import { print_expr } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("arg", function () {
    it("arg(exp(i*pi/3))", function () {
        const lines: string[] = [
            `implicate=0`,
            `arg(exp(i*pi/3))`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "1/3*π");
        engine.release();
    });
});
