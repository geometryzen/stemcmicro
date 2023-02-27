import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("divisors", function () {
    it("divisors(12)", function () {
        const lines: string[] = [
            `divisors(12)`
        ];
        const engine = create_script_engine({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[1,2,3,4,6,12]");
        engine.release();
    });
    it("divisors(3*x+3)", function () {
        const lines: string[] = [
            `divisors(3*x+3)`
        ];
        const engine = create_script_engine({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[1,3,1+x,3+3*x]");
        engine.release();
    });
});
