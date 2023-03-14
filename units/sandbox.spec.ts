
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("rect(polar((-1)^(a)))", function () {
        const lines: string[] = [
            `rect(polar((-1)^(a)))`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(pi*a)+i*sin(pi*a)");
        engine.release();
    });
});
