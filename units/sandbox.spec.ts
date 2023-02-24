import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";

describe("sandbox", function () {
    it("binomial(n,k)", function () {
        const lines: string[] = [
            `binomial(n,k)`
        ];
        const engine = createScriptEngine({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "n!/(k!*(-k+n)!)");
        engine.release();
    });
});
