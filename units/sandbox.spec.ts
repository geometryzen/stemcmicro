
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("log(-x)", function () {
        const lines: string[] = [
            `log(-x)`,
        ];
        const engine = create_script_context({
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "log(x)+i*pi");
        engine.release();
    });
});
