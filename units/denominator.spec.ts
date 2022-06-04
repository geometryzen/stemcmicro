import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../index";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("denominator", function () {
    it("denominator(2/3)", function () {
        const lines: string[] = [
            `denominator(2/3)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "3");
        assert.strictEqual(render_as_infix(actual, $), "3");

        engine.release();
    });
    it("denominator(x)", function () {
        const lines: string[] = [
            `denominator(x)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "1");
        assert.strictEqual(render_as_infix(actual, $), "1");

        engine.release();
    });
    it("denominator(1/x)", function () {
        const lines: string[] = [
            `denominator(1/x)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "x");
        assert.strictEqual(render_as_infix(actual, $), "x");

        engine.release();
    });
    it("denominator(a+b)", function () {
        const lines: string[] = [
            `denominator(a+b)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "1");
        assert.strictEqual(render_as_infix(actual, $), "1");

        engine.release();
    });
    it("denominator(1/(1/a)", function () {
        const lines: string[] = [
            `denominator(1/(1/a))`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "1");
        assert.strictEqual(render_as_infix(actual, $), "1");

        engine.release();
    });
    it("denominator(1/a+1/b)", function () {
        const lines: string[] = [
            `denominator(1/a+1/b)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(* a b)");
        assert.strictEqual(render_as_infix(actual, $), "a*b");

        engine.release();
    });
});
