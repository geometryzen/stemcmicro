import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";

describe("expcos", function () {
    it("expcos(x)", function () {
        const lines: string[] = [
            `expcos(x)`
        ];
        const engine = createScriptEngine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/2*(exp(x*i)+exp(-x*i))");
        engine.release();
    });
});
