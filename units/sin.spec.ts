import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sin", function () {
    it("sin(a)*cos(b)+cos(a)*sin(b)-sin(a+b) without factoring", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `sin(a)*cos(b)+cos(a)*sin(b)-sin(a+b)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), '0');
    });
});

describe("sin", function () {
    it("sin(x)", function () {
        const lines: string[] = [
            `sin(x)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), '(sin x)');
        assert.strictEqual(print_expr(value, $), 'sin(x)');
    });
    it("sin(-x)", function () {
        const lines: string[] = [
            `sin(-x)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), "(* -1 (sin x))");
        assert.strictEqual(print_expr(value, $), '-sin(x)');
    });
    it("sin(-x*y)", function () {
        const lines: string[] = [
            `sin(-x*y)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), '(* -1 (sin (* x y)))');
        assert.strictEqual(print_expr(value, $), '-sin(x*y)');
    });
    it("sin(-x*y*z)", function () {
        const lines: string[] = [
            `sin(-x*y*z)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), '(* -1 (sin (* x y z)))');
        assert.strictEqual(print_expr(value, $), '-sin(x*y*z)');
    });
    it("sin(a+b) without factoring", function () {
        // sin(a+b) = sin(a)*cos(b)+cos(a)*sin(b)
        // But under canonicalization, the sin and cos factors are switched, becoming
        // cos(b)*sin(a)+cos(a)*sin(b)
        // And then further canonicalization sorts on arguments which rearranges the terms to give
        // cos(a)*sin(b)+cos(b)*sin(a)
        // Actually, the angle addition and subtraction theorems universally put sin before cos.
        const lines: string[] = [
            `autofactor=0`,
            `sin(a+b)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'cos(a)*sin(b)+cos(b)*sin(a)');
    });
    it("sin(a+b) with factoring", function () {
        const lines: string[] = [
            `autofactor=1`,
            `sin(a+b)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'sin(a+b)');
    });
    it("sin(a-b) without factoring", function () {
        const lines: string[] = [
            `autofactor=0`,
            `sin(a-b)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), '-cos(a)*sin(b)+cos(b)*sin(a)');
    });
    it("sin(a-b) with factoring", function () {
        const lines: string[] = [
            `autofactor=1`,
            `sin(a-b)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'sin(a-b)');
    });
    it("sin(b+a) without factoring", function () {
        const lines: string[] = [
            `autofactor=0`,
            `sin(b+a)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'cos(a)*sin(b)+cos(b)*sin(a)');
    });
    it("sin(b+a) with factoring", function () {
        const lines: string[] = [
            `autofactor=1`,
            `sin(b+a)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'sin(a+b)');
    });
    it("sin(b-a) without factoring", function () {
        const lines: string[] = [
            `autofactor=0`,
            `sin(b-a)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'cos(a)*sin(b)-sin(a)*cos(b)');
    });
    it("sin(b-a) with factoring", function () {
        const lines: string[] = [
            `autofactor=1`,
            `sin(b-a)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'sin(-a+b)');
    });
    it("sin(b)*cos(a)-cos(b)*sin(a)", function () {
        // This test demonstrates that a canonical ordering of the sin, cos, and -1
        // parts of the previous expanded expression would lead to factorization.
        const lines: string[] = [
            `sin(b)*cos(a)-cos(b)*sin(a)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'sin(-a+b)');
    });
    it("sin(a+b)-(sin(a)*cos(b)+cos(a)*sin(b))", function () {
        const lines: string[] = [
            `autofactor=0`,
            `sin(a+b)-(sin(a)*cos(b)+cos(a)*sin(b))`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), '0');
    });
    it("sin(a)*cos(b)+cos(a)*sin(b)-sin(a+b) without factoring", function () {
        const lines: string[] = [
            `autofactor=0`,
            `sin(a)*cos(b)+cos(a)*sin(b)-sin(a+b)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), '0');
    });
    it("cos(b)*sin(a)+cos(a)*sin(b)-sin(a+b)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `cos(b)*sin(a)+cos(a)*sin(b)-sin(a+b)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), '0');
    });
});
