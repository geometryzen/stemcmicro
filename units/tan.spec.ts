import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("tan", function () {
    it("tan(x)", function () {
        const lines: string[] = [
            `tan(x)`
        ];
        const engine = create_engine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(tan x)");
        assert.strictEqual(engine.renderAsInfix(actual), "tan(x)");

        engine.release();
    });
});
