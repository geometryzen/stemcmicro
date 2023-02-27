import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("arg", function () {
    it("arg(exp(i*pi/3))", function () {
        const lines: string[] = [
            `arg(exp(i*pi/3))`,
        ];
        const engine = create_script_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/3*pi");
        engine.release();
    });
});
