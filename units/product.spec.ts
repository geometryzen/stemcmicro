import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";

describe("product", function () {
    it("2*product(float((4*k^2)/(4*k^2-1)),k,1,100)", function () {
        const lines: string[] = [
            `2*product(float((4*k^2)/(4*k^2-1)),k,1,100)`
        ];
        const engine = createScriptEngine({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "3.133787...");
        engine.release();
    });
});
