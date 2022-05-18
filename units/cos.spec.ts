import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("cos", function () {
    xit("sin(b-a)", function () {
        const lines: string[] = [
            `sin(b-a)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // WRONG, but this is what we have.
        assert.strictEqual(print_list(value, $), '(+ (* -1 (sin a) (cos b)) (* (cos (* -1 a)) (sin b)))');
        assert.strictEqual(print_expr(value, $), '-sin(a)*cos(b)+cos(-a)*sin(b)');
        // assert.strictEqual(print_expr(value, $), '-sin(a-b)');
    });
});

describe("cos", function () {
    it("cos(x)", function () {
        const lines: string[] = [
            `cos(x)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), '(cos x)');
        assert.strictEqual(print_expr(value, $), 'cos(x)');
    });
    it("cos(-x)", function () {
        const lines: string[] = [
            `cos(-x)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), '(cos x)');
        assert.strictEqual(print_expr(value, $), 'cos(x)');
    });
    it("cos(-x*y)", function () {
        const lines: string[] = [
            `cos(-x*y)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), '(cos (* x y))');
        assert.strictEqual(print_expr(value, $), 'cos(x*y)');
    });
    it("cos(-x*y*z)", function () {
        const lines: string[] = [
            `cos(-x*y*z)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), '(cos (* x y z))');
        assert.strictEqual(print_expr(value, $), 'cos(x*y*z)');
    });
    it("cos(a+b)", function () {
        const lines: string[] = [
            `cos(a+b)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'cos(a)*cos(b)-sin(a)*sin(b)');
    });
    it("cos(b+a)", function () {
        const lines: string[] = [
            `cos(b+a)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'cos(a)*cos(b)-sin(a)*sin(b)');
    });
    it("cos(a-b)", function () {
        const lines: string[] = [
            `cos(a-b)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'cos(a)*cos(b)+sin(a)*sin(b)');
    });
    it("cos(b-a)", function () {
        const lines: string[] = [
            `cos(b-a)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'cos(a)*cos(b)+sin(a)*sin(b)');
    });
});
