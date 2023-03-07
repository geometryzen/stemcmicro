import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("numerator(1/a+1/b)", function () {
        const lines: string[] = [
            `numerator(1/a+1/b)`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b)");
        assert.strictEqual(engine.renderAsInfix(actual), "a+b");

        engine.release();
    });
});
