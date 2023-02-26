import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("exp(-3/4*i*pi)", function () {
        const lines: string[] = [
            `exp(-3/4*i*pi)`
        ];
        const engine = createScriptEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-1/2*2**(1/2)-1/2*i*2**(1/2)");
        engine.release();
    });
});
