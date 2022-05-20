import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("trig", function () {
    // TODO: The problem with the rule based upon arguments is that it makes factoring harder.
    xdescribe("function ordering in factors is based upon their names and then arguments", function () {
        // TODO: So far this is only done for sin and cos.
        // However, also appies to tan, sec, cot
        it("sin(a)*cos(b)", function () {
            const lines: string[] = [
                `sin(a)*cos(b)`
            ];
            const engine = createSymEngine({
                dependencies: []
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(value, $), '(* (cos b) (sin a))');
            assert.strictEqual(print_expr(value, $), 'cos(b)*sin(a)');
        });
        it("cos(b)*sin(a)", function () {
            const lines: string[] = [
                `cos(b)*sin(a)`
            ];
            const engine = createSymEngine({
                dependencies: []
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(value, $), '(* (cos b) (sin a))');
            assert.strictEqual(print_expr(value, $), 'cos(b)*sin(a)');
        });
        it("sin(b)*cos(a)", function () {
            const lines: string[] = [
                `sin(b)*cos(a)`
            ];
            const engine = createSymEngine({
                dependencies: []
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(value, $), '(* (cos a) (sin b))');
            assert.strictEqual(print_expr(value, $), 'cos(a)*sin(b)');
        });
        it("cos(a)*sin(b)", function () {
            const lines: string[] = [
                `cos(a)*sin(b)`
            ];
            const engine = createSymEngine({
                dependencies: []
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(value, $), '(* (cos a) (sin b))');
            assert.strictEqual(print_expr(value, $), 'cos(a)*sin(b)');
        });
        it("sin(x)*cos(x)", function () {
            // How do we resolve the ambiguity when the arguments are the same?
            const lines: string[] = [
                `sin(x)*cos(x)`
            ];
            const engine = createSymEngine({
                dependencies: []
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(value, $), '(* (cos x) (sin x))');
            assert.strictEqual(print_expr(value, $), 'cos(x)*sin(x)');
        });
        it("cos(x)*sin(x)", function () {
            const lines: string[] = [
                `cos(x)*sin(x)`
            ];
            const engine = createSymEngine({
                dependencies: []
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(value, $), '(* (cos x) (sin x))');
            assert.strictEqual(print_expr(value, $), 'cos(x)*sin(x)');
        });
    });
});
