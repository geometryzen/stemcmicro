
import { assert } from "chai";
import { create_script_context } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    xit("x", function () {
        const lines: string[] = [
            `x`,
        ];
        const engine = create_script_context({ useDefinitions: false });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x");
        engine.release();
    });
    xit("sqrt(x)", function () {
        const lines: string[] = [
            `sqrt(x)`,
        ];
        const engine = create_script_context({ useDefinitions: false });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x**(1/2)");
        engine.release();
    });
    it("a=foo(x)", function () {
        const lines: string[] = [
            `a=foo(x)`,
            `a`
        ];
        const engine = create_script_context({ useDefinitions: false });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "foo(x)");
        engine.release();
    });
});