import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("derivative-sandbox", function () {
    it("d(cos(x),x)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `d(cos(x),x)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(* -1 (sin x))");
        assert.strictEqual(render_as_infix(actual, $), "-sin(x)");
        engine.release();
    });
});


describe("derivative", function () {
    it("d(f,x), when d is bound should be left alone", function () {
        const lines: string[] = [
            `d=foo`,
            `d(f,x)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(d f x)");
        assert.strictEqual(render_as_infix(actual, $), "d(f,x)");

        engine.release();
    });
    it("d(a,x), when d is not bound should be transformed to derivative", function () {
        const lines: string[] = [
            `d(a,x)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "0");
        assert.strictEqual(render_as_infix(actual, $), "0");

        engine.release();
    });
    it("d(x,x)", function () {
        const lines: string[] = [
            `d(x,x)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "1");
        assert.strictEqual(render_as_infix(actual, $), "1");

        engine.release();
    });
    it("d(x**2,x)", function () {
        // Looping
        const lines: string[] = [
            `d(x**2,x)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(* 2 x)");
        assert.strictEqual(render_as_infix(actual, $), "2*x");

        engine.release();
    });
    it("d(x*x,x)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `d(x*x,x)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual, $), "(* 2 x)");
        assert.strictEqual(render_as_infix(actual, $), "2*x");
        engine.release();
    });
    it("d(sin(x),x)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `d(sin(x),x)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(cos x)");
        assert.strictEqual(render_as_infix(actual, $), "cos(x)");
        engine.release();
    });
    it("d(cos(x),x)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `d(cos(x),x)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(* -1 (sin x))");
        assert.strictEqual(render_as_infix(actual, $), "-sin(x)");
        engine.release();
    });
});
