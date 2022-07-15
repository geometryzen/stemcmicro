import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("expcos", function () {
    it("expcos(x)", function () {
        const lines: string[] = [
            `expcos(x)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/2*(exp(x*i)+exp(-x*i))");
        engine.release();
    });
});
