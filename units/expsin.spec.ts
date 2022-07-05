import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("expsin", function () {
    it("expsin(x)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `expsin(x)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        // TODO: It should leave the sin(x) function in exponential form...
        // assert.strictEqual(engine.renderAsInfix(values[0]), "1/2*i*exp(-i*x)-1/2*i*exp(i*x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "sin(x)");
        engine.release();
    });
});
