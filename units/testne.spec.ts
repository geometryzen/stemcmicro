import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("testne", function () {
    it("0 != -0", function () {
        const lines: string[] = [
            `0 != -0`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
});
