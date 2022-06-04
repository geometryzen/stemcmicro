import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("trig", function () {
    describe("function ordering of trig functions in factors", function () {
        // TODO: So far this is only done for sin and cos.
        // However, also appies to tan, sec, cot
        it("sin(a)*cos(b)", function () {
            const lines: string[] = [
                `sin(a)*cos(b)`
            ];
            const engine = create_engine({
                dependencies: []
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(render_as_sexpr(value, $), '(* (cos b) (sin a))');
            assert.strictEqual(render_as_infix(value, $), 'cos(b)*sin(a)');
        });
        it("cos(b)*sin(a)", function () {
            const lines: string[] = [
                `cos(b)*sin(a)`
            ];
            const engine = create_engine({
                dependencies: []
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(render_as_sexpr(value, $), '(* (cos b) (sin a))');
            assert.strictEqual(render_as_infix(value, $), 'cos(b)*sin(a)');
        });
        it("sin(b)*cos(a)", function () {
            const lines: string[] = [
                `sin(b)*cos(a)`
            ];
            const engine = create_engine({
                dependencies: []
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(render_as_sexpr(value, $), '(* (cos a) (sin b))');
            assert.strictEqual(render_as_infix(value, $), 'cos(a)*sin(b)');
        });
        it("cos(a)*sin(b)", function () {
            const lines: string[] = [
                `cos(a)*sin(b)`
            ];
            const engine = create_engine({
                dependencies: []
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(render_as_sexpr(value, $), '(* (cos a) (sin b))');
            assert.strictEqual(render_as_infix(value, $), 'cos(a)*sin(b)');
        });
        it("sin(x)*cos(x)", function () {
            // How do we resolve the ambiguity when the arguments are the same?
            const lines: string[] = [
                `sin(x)*cos(x)`
            ];
            const engine = create_engine({
                dependencies: []
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(render_as_sexpr(value, $), '(* (cos x) (sin x))');
            assert.strictEqual(render_as_infix(value, $), 'cos(x)*sin(x)');
        });
        it("cos(x)*sin(x)", function () {
            const lines: string[] = [
                `cos(x)*sin(x)`
            ];
            const engine = create_engine({
                dependencies: []
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(render_as_sexpr(value, $), '(* (cos x) (sin x))');
            assert.strictEqual(render_as_infix(value, $), 'cos(x)*sin(x)');
        });
    });
});
