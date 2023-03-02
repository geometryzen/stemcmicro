import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    // We want to calculat the arg of this expression.
    // We can see that its evaluation gives rise to a sum.
    // That's a pity because arg(a/b) = arg(a)-arg(b), which seems easier.
    // We see that we will have to compute the arg of a sum.
    it("(a+i*b)/(c+i*d)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `(a+i*b)/(c+i*d)`
        ];
        const engine = create_script_engine({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "a/(c+i*d)+i*b/(c+i*d)");
        engine.release();
    });
    xit("arg((a+i*b)/(c+i*d))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg((a+i*b)/(c+i*d))`
        ];
        const engine = create_script_engine({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "arctan(a/b)-arctan(c/d)");
        engine.release();
    });
});
