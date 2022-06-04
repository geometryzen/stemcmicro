import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../index";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("rationalize", function () {
    it("rationalize(a/b+c/d)", function () {
        const lines: string[] = [
            `rationalize(a/b+c/d)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(* (+ (* a d) (* b c)) (power (* b d) -1))");
        assert.strictEqual(render_as_infix(actual, $), "(a*d+b*c)/(b*d)");

        engine.release();
    });
    it("rationalize(a/b+b/a)", function () {
        const lines: string[] = [
            `rationalize(a/b+b/a)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(* (+ (power a 2) (power b 2)) (power (* a b) -1))");
        assert.strictEqual(render_as_infix(actual, $), "(a^2+b^2)/(a*b)");

        engine.release();
    });
});