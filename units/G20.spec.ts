
import { assert } from "chai";
import { Directive } from "../src/env/ExtensionEnv";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("G20", function () {
    it("i=e1^e2 squares to -1", function () {
        const lines: string[] = [
            `G20=algebra([1,1],["ex","ey"])`,
            `e1=G20[1]`,
            `e2=G20[2]`,
            `i=e1^e2`,
            `i*i`,
        ];
        const engine = create_script_context({});
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "-1");
        engine.release();
    });
    it("Because i squares to -1, exp(i*theta) has an Euler expansion", function () {
        const lines: string[] = [
            `G20=algebra([1,1],["ex","ey"])`,
            `e1=G20[1]`,
            `e2=G20[2]`,
            `i=e1^e2`,
            `exp(i*theta)`,
        ];
        const engine = create_script_context({
            enable: [Directive.convertExpToTrig]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "cos(theta)+sin(theta)*ex^ey");
        engine.release();
    });
});
