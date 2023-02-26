import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("$$$", function () {
        const lines: string[] = [
            `choose(n,0)`
        ];
        const engine = createScriptEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1");
        engine.release();
    });
});
