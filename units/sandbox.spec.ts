import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("arg(a+i*b)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(a+i*b)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "arctan(b/a)");
        engine.release();
    });
    it("1/arg(a+i*b)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `1/arg(a+i*b)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1/(arctan(b/a))");
        engine.release();
    });
});
