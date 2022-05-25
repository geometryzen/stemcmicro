import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("abs", function () {
    it("abs(x+iy)", function () {
        const lines: string[] = [
            `implicate=0`,
            `abs(x+i*y)`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(print_expr(value, $), "(x**2+y**2)**(1/2)");
        engine.release();
    });
});

describe("abs", function () {
    it("abs(x)", function () {
        const lines: string[] = [
            `abs(x)`,
        ];
        const engine = createSymEngine({});
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "(x**2)**(1/2)");
        engine.release();
    });
    it("abs(iy)", function () {
        const lines: string[] = [
            `abs(sqrt(-1)*y)`,
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "(y**2)**(1/2)");
        engine.release();
    });
    it("abs(x+iy)", function () {
        const lines: string[] = [
            `abs(x+i*y)`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(print_expr(value, $), "(x**2+y**2)**(1/2)");
        engine.release();
    });
    it("x * i", function () {
        const lines: string[] = [
            `autofactor=0`,
            `prettyfmt=0`,
            `implicate=0`,
            `i=sqrt(-1)`,
            `x * i`,
        ];
        const engine = createSymEngine({ useDefinitions: false });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "x*i");
        engine.release();
    });
    it("-i * i * x * x", function () {
        const lines: string[] = [
            `autofactor=0`,
            `prettyfmt=0`,
            `implicate=0`,
            `i=sqrt(-1)`,
            `-i * i * x * x`,
        ];
        const engine = createSymEngine({ useDefinitions: false });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "x**2");
        engine.release();
    });
    it("(x-i*y)*(x+i*y)", function () {
        const lines: string[] = [
            `implicate=0`,
            `(x-i*y)*(x+i*y)`,
        ];
        const engine = createSymEngine({ useDefinitions: true });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), "(+ (power x 2) (power y 2))");
        assert.strictEqual(print_expr(value, $), "x**2+y**2");
        engine.release();
    });
    it("(x-i*y)*(x+i*y)", function () {
        const lines: string[] = [
            `(x-i*y)*(x+i*y)`,
        ];
        const engine = createSymEngine({ useDefinitions: true });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), "(+ (power x 2) (power y 2))");
        assert.strictEqual(print_expr(value, $), "x**2+y**2");
        engine.release();
    });
    it("abs(1+2.0*i)", function () {
        // FIXME
        const lines: string[] = [
            `implicate=0`,
            `i=sqrt(-1)`,
            `abs(1+2.0*i)`,
        ];
        const engine = createSymEngine({
            // FIXME: The absence of Imu causes this expression to loop.
            dependencies: ['Flt', 'Imu']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), "2.236068...");
        assert.strictEqual(print_expr(value, $), "2.236068...");
        engine.release();
    });
});
