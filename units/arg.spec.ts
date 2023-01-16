import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("arg", function () {
    it("arg(exp(i*pi/3))", function () {
        const lines: string[] = [
            `implicate=0`,
            `arg(exp(i*pi/3))`,
        ];
        const engine = createScriptEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/3*π");
        engine.release();
    });
});
