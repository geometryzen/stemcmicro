import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("inv", function () {
    it("inv(a)", function () {
        const lines: string[] = [
            `A=[[1,2],[3,4]]`,
            `inv(A)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[[-2,1],[3/2,-1/2]]");
        engine.release();
    });
    it("inv(a)", function () {
        const lines: string[] = [
            `inv(a)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "inv(a)");
        engine.release();
    });
    it("inv(inv(a))", function () {
        const lines: string[] = [
            `inv(inv(a))`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "a");
        engine.release();
    });
});
