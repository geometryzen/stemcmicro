import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("integral", function () {
    xit("integral(x*x,x)", function () {
        const lines: string[] = [
            `integral(x*x,x)`
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1/3*x**3");

        engine.release();
    });
    xit("integral(1/(a+b*x)^2,x)", function () {
        const lines: string[] = [
            `integral(1/(a+b*x)^2,x)+1/(b*(b*x+a))`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-1/(b*(b*x+a))");

        engine.release();
    });
});
