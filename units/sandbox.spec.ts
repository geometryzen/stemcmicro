
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("expsin(x)", function () {
        const lines: string[] = [
            `expsin(x)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/2*i*exp(-i*x)-1/2*i*exp(i*x)");
        engine.release();
    });
});
