import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("???", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg((a+i*b)/(c+i*d))`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "arctan(b/a)-arctan(d/c)");

        engine.release();
    });
});
