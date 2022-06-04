import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("roots", function () {
    xit("roots(a*x**2+b*x+c)", function () {
        const lines: string[] = [
            `roots(a*x**2+b*x+c)`
        ];
        const engine = create_engine({ useCaretForExponentiation: false });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(+ a b)");
        assert.strictEqual(render_as_infix(actual, $), "a+b");
        engine.release();
    });
    xit("roots(a*x^2+b*x+c)", function () {
        const lines: string[] = [
            `roots(a*x^2+b*x+c)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(+ a b)");
        assert.strictEqual(render_as_infix(actual, $), "a+b");
        engine.release();
    });
});
