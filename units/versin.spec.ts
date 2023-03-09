import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

// TODO: Define the versin function externally and then use it.
describe("exmple", function () {
    it("versin(x)", function () {
        const lines: string[] = [
            `versin(x)`
        ];
        const engine = create_script_context({

        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1-cos(x)");
        engine.release();
    });
    it("versin(pi)", function () {
        const lines: string[] = [
            `pi=tau(1)/2`,
            `versin(pi)`
        ];
        const engine = create_script_context({

        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "2");
        engine.release();
    });
    it("versin(2*pi)", function () {
        const lines: string[] = [
            `pi=tau(1)/2`,
            `versin(2*pi)`
        ];
        const engine = create_script_context({

        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
});
