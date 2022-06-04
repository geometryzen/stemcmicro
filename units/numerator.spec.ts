import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../index";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("numerator", function () {
    it("numerator(2/3)", function () {
        const lines: string[] = [
            `numerator(2/3)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "2");
        assert.strictEqual(render_as_infix(actual, $), "2");

        engine.release();
    });
    it("numerator(x)", function () {
        const lines: string[] = [
            `numerator(x)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "x");
        assert.strictEqual(render_as_infix(actual, $), "x");

        engine.release();
    });
    it("numerator(1/x)", function () {
        const lines: string[] = [
            `numerator(1/x)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "1");
        assert.strictEqual(render_as_infix(actual, $), "1");

        engine.release();
    });
    it("numerator(a+b)", function () {
        const lines: string[] = [
            `numerator(a+b)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(+ a b)");
        assert.strictEqual(render_as_infix(actual, $), "a+b");

        engine.release();
    });
    it("numerator(1/(1/a)", function () {
        const lines: string[] = [
            `numerator(1/(1/a))`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "a");
        assert.strictEqual(render_as_infix(actual, $), "a");

        engine.release();
    });
    it("numerator(1/a+1/b)", function () {
        const lines: string[] = [
            `numerator(1/a+1/b)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(+ a b)");
        assert.strictEqual(render_as_infix(actual, $), "a+b");

        engine.release();
    });
});
