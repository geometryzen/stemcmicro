import { assert } from "chai";
import { render_as_infix, render_as_latex, render_as_sexpr } from "../index";
import { create_env } from "../src/env/env";
import { MATH_ADD, MATH_E, MATH_IMU, MATH_MUL, MATH_POW } from "../src/runtime/ns_math";
import { create_engine } from "../src/runtime/symengine";
import { Sym } from "../src/tree/sym/Sym";

describe("env", function () {
    describe("constructor", function () {
        it("should be defined", function () {
            const $ = create_env();
            assert.isDefined($);
        });
    });
    describe("tokens", function () {
        it("exp(1) (default)", function () {
            const lines: string[] = [
                `exp(1)`
            ];
            const engine = create_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            const $ = engine.$;
            assert.strictEqual(render_as_infix(values[0], $), "e");
            assert.strictEqual(render_as_sexpr(values[0], $), "e");
            assert.strictEqual(render_as_latex(values[0], $), "e");
            engine.release();
        });
        it("exp(1) (override)", function () {
            const lines: string[] = [
                `exp(1)`
            ];
            const engine = create_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            const $ = engine.$;
            $.setSymbolToken(MATH_E, 'E');
            assert.strictEqual(render_as_infix(values[0], $), "E");
            assert.strictEqual(render_as_sexpr(values[0], $), "e");
            assert.strictEqual(render_as_latex(values[0], $), "e");
            engine.release();
        });
        it("sqrt(-1) (default)", function () {
            const lines: string[] = [
                `sqrt(-1)`
            ];
            const engine = create_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            const $ = engine.$;
            assert.strictEqual(render_as_infix(values[0], $), "i");
            assert.strictEqual(render_as_sexpr(values[0], $), "i");
            assert.strictEqual(render_as_latex(values[0], $), "i");
            engine.release();
        });
        it("sqrt(-1) (override)", function () {
            const lines: string[] = [
                `sqrt(-1)`
            ];
            const engine = create_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            const $ = engine.$;
            $.setSymbolToken(MATH_IMU, 'I');
            assert.strictEqual(render_as_infix(values[0], $), "I");
            assert.strictEqual(render_as_sexpr(values[0], $), "I");
            assert.strictEqual(render_as_latex(values[0], $), "i");
            engine.release();
        });
        it("a+b (default)", function () {
            const lines: string[] = [
                `a+b`
            ];
            const engine = create_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            const $ = engine.$;
            assert.strictEqual(render_as_infix(values[0], $), "a+b");
            assert.strictEqual(render_as_sexpr(values[0], $), "(+ a b)");
            assert.strictEqual(render_as_latex(values[0], $), "a+b");
            engine.release();
        });
        it("a+b (override)", function () {
            const lines: string[] = [
                `a+b`
            ];
            const engine = create_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            const $ = engine.$;
            $.setSymbolToken(MATH_ADD, 'ADD');
            assert.strictEqual(render_as_infix(values[0], $), "a+b");
            assert.strictEqual(render_as_sexpr(values[0], $), "(ADD a b)");
            assert.strictEqual(render_as_latex(values[0], $), "a+b");
            engine.release();
        });
        it("a*b (default)", function () {
            const lines: string[] = [
                `a*b`
            ];
            const engine = create_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            const $ = engine.$;
            assert.strictEqual(render_as_infix(values[0], $), "a*b");
            assert.strictEqual(render_as_sexpr(values[0], $), "(* a b)");
            assert.strictEqual(render_as_latex(values[0], $), "ab");
            engine.release();
        });
        it("a*b (override)", function () {
            const lines: string[] = [
                `a*b`
            ];
            const engine = create_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            const $ = engine.$;
            $.setSymbolToken(MATH_MUL, 'MUL');
            assert.strictEqual(render_as_infix(values[0], $), "a*b");
            assert.strictEqual(render_as_sexpr(values[0], $), "(MUL a b)");
            assert.strictEqual(render_as_latex(values[0], $), "ab");
            engine.release();
        });
        it("a**b (default)", function () {
            const lines: string[] = [
                `a**b`
            ];
            const engine = create_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            const $ = engine.$;
            assert.strictEqual(render_as_infix(values[0], $), "a**b");
            assert.strictEqual(render_as_sexpr(values[0], $), "(power a b)");
            assert.strictEqual(render_as_latex(values[0], $), "a^b");
            engine.release();
        });
        it("a^b (default)", function () {
            const lines: string[] = [
                `a^b`
            ];
            const engine = create_engine({ useCaretForExponentiation: true });
            const { values } = engine.executeScript(lines.join('\n'));
            const $ = engine.$;
            assert.strictEqual(render_as_infix(values[0], $), "a^b");
            assert.strictEqual(render_as_sexpr(values[0], $), "(power a b)");
            assert.strictEqual(render_as_latex(values[0], $), "a^b");
            engine.release();
        });
        it("a**b (override)", function () {
            const lines: string[] = [
                `a**b`
            ];
            const engine = create_engine();
            const { values } = engine.executeScript(lines.join('\n'));
            const $ = engine.$;
            $.setSymbolToken(MATH_POW, 'POW');
            assert.strictEqual(render_as_infix(values[0], $), "a**b");
            assert.strictEqual(render_as_sexpr(values[0], $), "(POW a b)");
            assert.strictEqual(render_as_latex(values[0], $), "a^b");
            engine.release();
        });
    });
    describe("negate", function () {
        it("should multiply by minus one.", function () {
            const engine = create_engine();
            const $ = engine.$;
            const x = new Sym('x');
            assert.strictEqual(render_as_sexpr(x, $), 'x');
            const negX = $.negate(x);
            assert.strictEqual(render_as_sexpr(negX, $), '(* -1 x)');
        });
        it("should be an involution.", function () {
            const engine = create_engine();
            const $ = engine.$;
            const x = new Sym('x');
            assert.strictEqual(render_as_sexpr(x, $), 'x');
            const origX = $.negate($.negate(x));
            assert.strictEqual(render_as_sexpr(origX, $), 'x');
        });
    });
});
