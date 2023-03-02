import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("roots(x^2==1)", function () {
        const lines: string[] = [
            `roots(x^2==1)`
        ];
        const engine = create_script_engine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[-1,1]");
        engine.release();
    });
});
