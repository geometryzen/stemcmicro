import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("clock", function () {
    xit("i", function () {
        const lines: string[] = [
            `clock(i)`,
        ];
        const engine = create_script_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "i");
        engine.release();
    });
    xit("(1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i)", function () {
        const lines: string[] = [
            `(1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i)`,
        ];
        const engine = create_script_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "3**(1/2)*i");
        engine.release();
    });
    xit("((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i", function () {
        const lines: string[] = [
            `((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i`,
        ];
        const engine = create_script_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "-3**(1/2)");
        engine.release();
    });
    xit("-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i", function () {
        const lines: string[] = [
            `-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i`,
        ];
        const engine = create_script_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "1/2*3**(1/2)");
        engine.release();
    });
    xit("(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2", function () {
        const lines: string[] = [
            `(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2`,
        ];
        const engine = create_script_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "3/4");
        engine.release();
    });
    xit("1/4+(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2", function () {
        const lines: string[] = [
            `1/4+(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2`,
        ];
        const engine = create_script_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "1");
        engine.release();
    });
    xit("(1/4+(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2)**(1/2)", function () {
        const lines: string[] = [
            `(1/4+(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2)**(1/2)`,
        ];
        const engine = create_script_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "1");
        engine.release();
    });
    xit("exp(i*pi/3)", function () {
        const lines: string[] = [
            `exp(i*pi/3)`,
        ];
        const engine = create_script_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "1/2+(1/2*3**(1/2))*i");
        engine.release();
    });
    xit("clock(exp(i*pi/3))", function () {
        const lines: string[] = [
            `clock(exp(i*pi/3))`,
        ];
        const engine = create_script_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "(-1)**(1/3)");
        engine.release();
    });
});
