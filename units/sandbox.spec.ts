
import { assert } from "chai";
import { Directive } from "../src/env/ExtensionEnv";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("abs(a+b)", function () {
        const lines: string[] = [
            `abs(a+b)`,
        ];
        const engine = create_script_context({
            enable: [Directive.expandAbsSum, Directive.expandPowerSum],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "2*a*b+a**2+b**2");
        engine.release();
    });
    xit("abs(a+i*b)", function () {
        const lines: string[] = [
            `abs(a+i*b)`,
        ];
        const engine = create_script_context({
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "(a**2+b**2)**(1/2)");
        engine.release();
    });
    xit("sqrt(-1)", function () {
        const lines: string[] = [
            `sqrt(-1)`,
        ];
        const engine = create_script_context({
            enable: [Directive.complexAsPolar],
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "exp(1/2*i*pi)");
        engine.release();
    });
    xit("sqrt(-1)", function () {
        const lines: string[] = [
            `sqrt(-1)`,
        ];
        const engine = create_script_context({
            enable: [Directive.complexAsClock],
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "(-1)**(1/2)");
        engine.release();
    });
    xit("sqrt(-1)", function () {
        const lines: string[] = [
            `sqrt(-1)`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(engine.renderAsInfix(value), "e**(1/2*i*pi)");
        assert.strictEqual(engine.renderAsInfix(value), "i");
        engine.release();
    });
    xit("polar(sqrt(-1))", function () {
        const lines: string[] = [
            `polar(sqrt(-1))`,
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
