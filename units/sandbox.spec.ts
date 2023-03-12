
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("rendering", function () {
    it("abs(x)", function () {
        const lines: string[] = [
            `abs(x)`,
        ];
        const engine = create_script_context({});
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsAscii(value), "abs(x)");
        assert.strictEqual(engine.renderAsHuman(value), "abs(x)");
        assert.strictEqual(engine.renderAsInfix(value), "abs(x)");
        assert.strictEqual(engine.renderAsLaTeX(value), "\\left |x \\right |");
        assert.strictEqual(engine.renderAsSExpr(value), "(abs x)");
        engine.release();
    });
});
