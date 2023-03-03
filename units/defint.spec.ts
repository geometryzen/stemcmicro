import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("defint", function () {
    xit("defint(x^2,y,0,sqrt(1-x^2),x,-1,1)", function () {
        const lines: string[] = [
            `defint(x^2,y,0,sqrt(1-x^2),x,-1,1)`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* 1/8 pi)");
        assert.strictEqual(engine.renderAsInfix(actual), "1/8*pi");

        engine.release();
    });
});
