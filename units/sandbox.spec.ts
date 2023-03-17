
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("polar(i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `polar(i)`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(engine.renderAsInfix(value), "e**(1/2*i*pi)");
        assert.strictEqual(engine.renderAsInfix(value), "exp(1/2*i*pi)");
        engine.release();
    });
    xit("", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1)/2`,
            `exp(1/3*i*pi)`
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1/2+1/2*i*3**(1/2)");
        engine.release();
    });
});
