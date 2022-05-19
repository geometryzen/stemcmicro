import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sin", function () {
    xit("sin(b-a)", function () {
        // TODO: We must either match the expression as given or canonicalize it
        // so that it can be recognized by the existing transformer.
        // Ideas for canonicalization:
        // 1. Ordering of trig functions.
        // 2. Affinity of Trig functions.
        // 3. Canonical association may not be left- or right-association.
        const lines: string[] = [
            `autoexpand=1`,
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
    it("sin(a+b)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `sin(a+b)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'sin(a)*cos(b)+cos(a)*sin(b)');
    });
    it("sin(a+b)", function () {
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
    it("sin(a-b)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `sin(a-b)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'sin(a)*cos(b)-cos(a)*sin(b)');
    });
    it("sin(a-b)", function () {
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
    it("sin(b+a)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `sin(b+a)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), 'sin(a)*cos(b)+cos(a)*sin(b)');
    });
    it("sin(b+a)", function () {
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
    it("sin(b-a)", function () {
        // TODO: We must either match the expression as given or canonicalize it
        // so that it can be recognized by the existing transformer.
        // Ideas for canonicalization:
        // 1. Ordering of trig functions.
        // 2. Affinity of Trig functions.
        // 3. Canonical association may not be left- or right-association.
        const lines: string[] = [
            `sin(b-a)`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), '-sin(a)*cos(b)+cos(a)*sin(b)');
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
});
