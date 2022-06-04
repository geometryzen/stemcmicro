import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../src/print";
import { MATH_ADD, MATH_MUL } from "../src/runtime/ns_math";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("assoc", function () {
    it("A", function () {
        const lines: string[] = [
            `bake=0`,
            `autofactor=0`,
            `implicate=0`,
            `a+b+c+d`,
        ];
        const engine = create_engine({
            assocs: [{ sym: MATH_ADD, dir: 'R' }],
            useCaretForExponentiation: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(value, $), '(+ a (+ b (+ c d)))');
        assert.strictEqual(render_as_infix(value, $), 'a+(b+(c+d))');
        engine.release();
    });
});

describe("assoc", function () {
    describe("Add", function () {
        it("A", function () {
            const lines: string[] = [
                `bake=0`,
                `implicate=0`,
                `a+b+c+d`,
            ];
            const engine = create_engine({
                assocs: [{ sym: MATH_ADD, dir: 'R' }],
                useCaretForExponentiation: true
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(render_as_sexpr(value, $), '(+ a (+ b (+ c d)))');
            assert.strictEqual(render_as_infix(value, $), 'a+(b+(c+d))');
            engine.release();
        });
        it("B", function () {
            const lines: string[] = [
                `implicate=0`,
                `a+b+c+d`,
            ];
            const engine = create_engine({ useCaretForExponentiation: true });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(render_as_sexpr(value, $), '(+ (+ (+ a b) c) d)');
            assert.strictEqual(render_as_infix(value, $), '((a+b)+c)+d');
            engine.release();
        });
        it("C", function () {
            const lines: string[] = [
                `implicate=1`,
                `a+b+c+d`,
            ];
            const engine = create_engine({ useCaretForExponentiation: true });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(render_as_sexpr(value, $), '(+ a b c d)');
            assert.strictEqual(render_as_infix(value, $), 'a+b+c+d');
            engine.release();
        });
        it("D", function () {
            const lines: string[] = [
                `implicate=1`,
                `a+b+c+d`,
            ];
            const engine = create_engine({
                assocs: [{ sym: MATH_ADD, dir: 'R' }],
                useCaretForExponentiation: true
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(render_as_sexpr(value, $), '(+ a b c d)');
            assert.strictEqual(render_as_infix(value, $), 'a+b+c+d');
            engine.release();
        });
    });
    describe("Multiply", function () {
        it("A", function () {
            const lines: string[] = [
                `implicate=0`,
                `a*b*c*d`,
            ];
            const engine = create_engine({
                assocs: [{ sym: MATH_MUL, dir: 'R' }],
                useCaretForExponentiation: true
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(render_as_sexpr(value, $), '(* a (* b (* c d)))');
            assert.strictEqual(render_as_infix(value, $), 'a*(b*(c*d))');
            engine.release();
        });
        it("B", function () {
            const lines: string[] = [
                `implicate=0`,
                `a*b*c*d`,
            ];
            const engine = create_engine({ useCaretForExponentiation: true });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(render_as_sexpr(value, $), '(* (* (* a b) c) d)');
            assert.strictEqual(render_as_infix(value, $), '((a*b)*c)*d');
            engine.release();
        });
        it("C", function () {
            const lines: string[] = [
                `implicate=1`,
                `a*b*c*d`,
            ];
            const engine = create_engine({ useCaretForExponentiation: true });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(render_as_sexpr(value, $), '(* a b c d)');
            assert.strictEqual(render_as_infix(value, $), 'a*b*c*d');
            engine.release();
        });
        it("D", function () {
            const lines: string[] = [
                `implicate=1`,
                `a*b*c*d`,
            ];
            const engine = create_engine({
                assocs: [{ sym: MATH_MUL, dir: 'R' }],
                useCaretForExponentiation: true
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(render_as_sexpr(value, $), '(* a b c d)');
            assert.strictEqual(render_as_infix(value, $), 'a*b*c*d');
            engine.release();
        });
    });
});
