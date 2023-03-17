
import { assert } from "chai";
import { Directive } from "../src/env/ExtensionEnv";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("exp(-i*x)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `exp(-i*x)`
        ];
        const engine = create_script_context({
            enable: [Directive.convertExpToTrig],
            useDefinitions: false
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "cos(x)-i*sin(x)");
        engine.release();
    });
});
