import { assert } from "chai";
import { render_as_infix } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("clock", function () {
    it("i", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `clock(i)`,
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(render_as_infix(value, $), "i");
        engine.release();
    });
    it("(1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i)", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `(1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i)`,
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(render_as_infix(value, $), "3**(1/2)*i");
        engine.release();
    });
    it("((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i`,
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(render_as_infix(value, $), "-3**(1/2)");
        engine.release();
    });
    it("-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i`,
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(render_as_infix(value, $), "1/2*3**(1/2)");
        engine.release();
    });
    it("(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2`,
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(render_as_infix(value, $), "3/4");
        engine.release();
    });
    it("1/4+(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `1/4+(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2`,
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(render_as_infix(value, $), "1");
        engine.release();
    });
    it("(1/4+(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2)**(1/2)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `(1/4+(-1/2*((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))*i)**2)**(1/2)`,
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(render_as_infix(value, $), "1");
        engine.release();
    });
    it("exp(i*pi/3)", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `exp(i*pi/3)`,
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(render_as_infix(value, $), "1/2+(1/2*3**(1/2))*i");
        engine.release();
    });
    it("clock(exp(i*pi/3))", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `clock(exp(i*pi/3))`,
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(render_as_infix(value, $), "(-1)**(1/3)");
        engine.release();
    });
});
