import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";

describe("expsin", function () {
    it("expsin(x)", function () {
        const lines: string[] = [
            `expsin(x)`
        ];
        const engine = createScriptEngine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/2*(-exp(x*i)+exp(-x*i))*i");
        engine.release();
    });
});
