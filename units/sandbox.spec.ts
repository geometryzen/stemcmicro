import { assert } from "chai";
import { createScriptEngine } from "../index";

describe("sandbox", function () {
    it("exp(-i*x)", function () {
        const lines: string[] = [
            `exp(-i*x)`
        ];
        const engine = createScriptEngine({
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(x)-sin(x)*i");
        engine.release();
    });
});
