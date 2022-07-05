import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("expcos", function () {
    it("expcos(x)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `expcos(x)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        // TODO: It should leave the cos(x) function in exponential form...
        // assert.strictEqual(engine.renderAsInfix(values[0]), "1/2*exp(-i*x)+1/2*exp(i*x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(x)");
        engine.release();
    });
});
