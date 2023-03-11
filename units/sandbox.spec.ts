
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("isreal(x**(3/2))", function () {
        const lines: string[] = [
            `isreal(x**(3/2))`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "false");
        engine.release();
    });
    xit("real((-1)**(1/3))", function () {
        const lines: string[] = [
            `real((-1)**(1/3))`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/2");
        engine.release();
    });
    xit("imag((-1)**(1/3))", function () {
        const lines: string[] = [
            `imag((-1)**(1/3))`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/2*sqrt(3)");
        engine.release();
    });
    xit("arg((-1)**(1/3))", function () {
        const lines: string[] = [
            `arg((-1)**(1/3))`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/3*pi");
        engine.release();
    });
});
