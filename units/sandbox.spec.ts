import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("log(exp(1))", function () {
        const lines: string[] = [
            `log(exp(1))`
        ];
        const engine = create_script_engine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1");
        engine.release();
    });
    it("log(exp(x))", function () {
        const lines: string[] = [
            `log(exp(x))`
        ];
        const engine = create_script_engine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "x");
        engine.release();
    });
});
