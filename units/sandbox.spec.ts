
import { assert } from "chai";
import { create_script_context } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("[1,2,3]", function () {
        const lines: string[] = [
            `[1,2,3]`
        ];
        const engine = create_script_context({
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "[1,2,3]");
        // TODO: This can't be right because it does not parse in Scheme.
        assert.strictEqual(engine.renderAsSExpr(value), "[1,2,3]");
        engine.release();
    });
});