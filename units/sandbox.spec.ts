
import { assert } from "chai";
import { create_script_context } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("arg(abs(a))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `arg(abs(a))`,
        ];
        const engine = create_script_context({
            assumes: {
                'a': { real: true },
                'b': { real: true }
            },
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    xit("arg(abs(a)*exp(b+i*pi/5))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `arg(abs(a)*exp(b+i*pi/5))`,
        ];
        const engine = create_script_context({
            assumes: {
                'a': { real: true },
                'b': { real: true }
            },
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/5*pi");
        engine.release();
    });
});
