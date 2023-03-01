import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("-1**0 is treated as -(1**0) and so evaluates to -1", function () {
        const lines: string[] = [
            `-1**0`
        ];
        const engine = create_script_engine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "-1");
        assert.strictEqual(engine.renderAsInfix(actual), "-1");
        engine.release();
    });
    it("(-1)**0", function () {
        const lines: string[] = [
            `(-1)**0`
        ];
        const engine = create_script_engine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "1");
        assert.strictEqual(engine.renderAsInfix(actual), "1");
        engine.release();
    });
});
