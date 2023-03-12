import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("rect", function () {
    it("exp(i*pi/3)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `rect(exp(i*pi/3))`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/2+1/2*i*3**(1/2)");
        engine.release();
    });
    it("rect(5*e**(i*arctan(4/3)))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `e=exp(1)`,
            `rect(5*e**(i*arctan(4/3)))`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "3+4*i");
        engine.release();
    });
    it("rect(polar(3+4*i))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `e=exp(1)`,
            `rect(polar(3+4*i))`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "3+4*i");
        engine.release();
    });
});
