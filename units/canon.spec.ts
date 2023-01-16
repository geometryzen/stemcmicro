import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("canon", function () {
    describe("Ordering", function () {
        it("...", function () {
            const lines: string[] = [
                `implicate=0`,
                `i * x * pi * 2`
            ];
            const engine = createScriptEngine({
                dependencies: ['Imu'],
                useDefinitions: true
            });
            const expr = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(engine.renderAsSExpr(expr), '(+ (* (| a c) b) (* (| a b) c))');
            assert.strictEqual(engine.renderAsInfix(expr), '((2*π)*x)*i');
            engine.release();
        });
    });
    describe("mul_2_inner_2_vector_vector_vector", function () {
        it("(a|b)*c", function () {
            const lines: string[] = [
                `(a|b)*c`
            ];
            const engine = createScriptEngine({ treatAsVectors: ['a', 'b', 'c'] });
            const expr = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(expr), '(* (| a b) c)');
            assert.strictEqual(engine.renderAsInfix(expr), 'a|b*c');
            engine.release();
        });
        it("c*(a|b)", function () {
            const lines: string[] = [
                `c*(a|b)`
            ];
            const engine = createScriptEngine({ treatAsVectors: ['a', 'b', 'c'] });
            const expr = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(expr), '(* (| a b) c)');
            assert.strictEqual(engine.renderAsInfix(expr), 'a|b*c');
            engine.release();
        });
        it("c*(b|a)", function () {
            const lines: string[] = [
                `c*(b|a)`
            ];
            const engine = createScriptEngine({ treatAsVectors: ['a', 'b', 'c'] });
            const expr = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(expr), '(* (| a b) c)');
            assert.strictEqual(engine.renderAsInfix(expr), 'a|b*c');
            engine.release();
        });
        it("(c|b)*a", function () {
            const lines: string[] = [
                `(c|b)*a`
            ];
            const engine = createScriptEngine({ treatAsVectors: ['a', 'b', 'c'] });
            const expr = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(expr), '(* (| b c) a)');
            assert.strictEqual(engine.renderAsInfix(expr), 'b|c*a');
            engine.release();
        });
        it("a*(c|b)", function () {
            const lines: string[] = [
                `a*(c|b)`
            ];
            const engine = createScriptEngine({ treatAsVectors: ['a', 'b', 'c'] });
            const expr = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(expr), '(* (| b c) a)');
            assert.strictEqual(engine.renderAsInfix(expr), 'b|c*a');
            engine.release();
        });
        it("a*(b|c)", function () {
            const lines: string[] = [
                `a*(b|c)`
            ];
            const engine = createScriptEngine({ treatAsVectors: ['a', 'b', 'c'] });
            const expr = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(expr), '(* (| b c) a)');
            assert.strictEqual(engine.renderAsInfix(expr), 'b|c*a');
            engine.release();
        });
        it("(c|a)*b", function () {
            const lines: string[] = [
                `(c|a)*b`
            ];
            const engine = createScriptEngine({ treatAsVectors: ['a', 'b', 'c'] });
            const expr = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(expr), '(* (| a c) b)');
            assert.strictEqual(engine.renderAsInfix(expr), 'a|c*b');
            engine.release();
        });
        it("b*(c|a)", function () {
            const lines: string[] = [
                `b*(c|a)`
            ];
            const engine = createScriptEngine({ treatAsVectors: ['a', 'b', 'c'] });
            const expr = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(expr), '(* (| a c) b)');
            assert.strictEqual(engine.renderAsInfix(expr), 'a|c*b');
            engine.release();
        });
        it("b*(a|c)", function () {
            const lines: string[] = [
                `b*(a|c)`
            ];
            const engine = createScriptEngine({ treatAsVectors: ['a', 'b', 'c'] });
            const expr = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(expr), '(* (| a c) b)');
            assert.strictEqual(engine.renderAsInfix(expr), 'a|c*b');
            engine.release();
        });
    });

    describe("add_2_mul_2_inner_2_sym_sym_sym_mul_2_inner_2_sym_sym_sym", function () {
        it("(a|b)*c+(a|c)*b", function () {
            const lines: string[] = [
                `(a|b)*c+(a|c)*b`
            ];
            const engine = createScriptEngine({
                dependencies: ['Vector'],
                treatAsVectors: ['a', 'b', 'c']
            });
            const expr = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(expr), '(+ (* (| a c) b) (* (| a b) c))');
            assert.strictEqual(engine.renderAsInfix(expr), 'a|c*b+a|b*c');
            engine.release();
        });
    });
});
