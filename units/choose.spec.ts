import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";

describe("choose", function () {
    it("choose(n,k)", function () {
        const lines: string[] = [
            `choose(n,k)`
        ];
        const engine = createScriptEngine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "n!/(k!*(-k+n)!)");
        engine.release();
    });
});
