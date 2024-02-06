import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("testle", function () {
    it("a < a + 1", function () {
        const lines: string[] = [
            `a < a + 1`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "true");
        engine.release();
    });
});
