
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("abs(1^a)*b", function () {
        const lines: string[] = [
            `abs(1^a)*b`,
        ];
        const engine = create_script_context({ useDefinitions: true, useCaretForExponentiation: true });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "b");
        engine.release();
    });
    xit("exp(i*a*pi)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1)/2`,
            `exp(i*a*pi)`,
        ];
        const engine = create_script_context({ useDefinitions: true });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // exp should not be eagerly expanding using the Euler formula.
        assert.strictEqual(engine.renderAsInfix(value), "exp(i*a*pi)");
        engine.release();
    });
    it("polar((-1)^a)", function () {
        const lines: string[] = [
            `polar((-1)^a)`,
        ];
        const engine = create_script_context({ useDefinitions: true, useCaretForExponentiation: true });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "exp(i*pi*a)");
        engine.release();
    });
});
