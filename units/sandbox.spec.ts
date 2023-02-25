import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("1+x+x^2", function () {
        const lines: string[] = [
            `1+x+x^2`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x^2+x+1");
        engine.release();
    });
    it("1+a+a^2", function () {
        const lines: string[] = [
            `1+a+a^2`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1+a+a^2");
        engine.release();
    });
});
