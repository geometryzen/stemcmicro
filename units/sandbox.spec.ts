
import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("log(clock(i))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `log(clock(i))`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1/2*i*pi");
        engine.release();
    });
    xit("clock(i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `clock(i)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "(-1)^(1/2)");
        engine.release();
    });
    it("clock(real(log(i)))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `clock(real(log(clock(i))))`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0");
        engine.release();
    });
});
