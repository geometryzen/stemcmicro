import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("(-1)^(1/2)*0.0", function () {
        const lines: string[] = [
            `(-1)^(1/2)*0.0`
        ];
        const engine = create_script_engine({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0.0");
        engine.release();
    });
    it("0.0*(-1)^(1/2)", function () {
        const lines: string[] = [
            `0.0*(-1)^(1/2)`
        ];
        const engine = create_script_engine({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0.0");
        engine.release();
    });
    xit("1.0*(-1)^(1/2)", function () {
        const lines: string[] = [
            `1.0*(-1)^(1/2)`
        ];
        const engine = create_script_engine({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1.0*i");
        engine.release();
    });
    xit("1+1.0*(-1)^(1/2)", function () {
        const lines: string[] = [
            `1+1.0*(-1)^(1/2)`
        ];
        const engine = create_script_engine({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1.0+1.0*i");
        engine.release();
    });
    xit("abs(1+1.0*(-1)^(1/2))", function () {
        const lines: string[] = [
            `abs(1+1.0*(-1)^(1/2))`
        ];
        const engine = create_script_engine({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1.414214...");
        engine.release();
    });
});
