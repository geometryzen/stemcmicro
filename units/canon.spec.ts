import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("canon", function () {
    describe("Ordering", function () {
        it("...", function () {
            const lines: string[] = [
                `x*pi*i*2`
            ];
            const engine = createScriptEngine({
                dependencies: ['Imu'],
                useDefinitions: true
            });
            const expr = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(expr), '2*i*pi*x');
            engine.release();
        });
    });
});
