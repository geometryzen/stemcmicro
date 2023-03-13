import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("polar", function () {
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
    it("1+i", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `polar(1+i)`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(engine.renderAsInfix(value), "2**(1/2)*e**(1/4*i*pi)");
        assert.strictEqual(engine.renderAsInfix(value), "exp(1/4*i*pi)*2**(1/2)");
        engine.release();
    });
    it("polar(3+4*i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `polar(3+4*i)`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(engine.renderAsInfix(value), "5*e**(i*arctan(4/3))");
        assert.strictEqual(engine.renderAsInfix(value), "5*exp(i*arctan(4/3))");
        engine.release();
    });
});
