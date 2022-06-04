import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../index";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("simplify", function () {
    xit("simplify(exp(-3/4*i*pi))", function () {
        const lines: string[] = [
            `simplify(exp(-3/4*i*pi))`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(power e (* -3/4 i pi))");
        assert.strictEqual(render_as_infix(actual, $), "e**(-3/4*i*pi)");

        engine.release();
    });
    // This currently loops because clockform calls abs which goes to inner product and nothing gets any simpler.
    xit("cos(x)^2+sin(x)^2", function () {
        const lines: string[] = [
            `simplify(cos(x)^2+sin(x)^2)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "1");
        assert.strictEqual(render_as_infix(actual, $), "1");

        engine.release();
    });
});
