
import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { create_script_context } from "../index";

describe("sandbox", function () {
    it("rect(1/(x+i*y))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `rect(1/(x+i*y))`,
        ];
        const engine = create_script_context({
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x/(x**2+y**2)-i*y/(x**2+y**2)");
        engine.release();
    });
});