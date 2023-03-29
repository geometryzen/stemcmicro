
import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { create_script_context } from "../index";

describe("sandbox", function () {
    it("rect(a)", function () {
        const lines: string[] = [
            `rect(a)`,
        ];
        const engine = create_script_context({
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a");
        engine.release();
    });
});