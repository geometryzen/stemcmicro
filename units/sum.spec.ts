import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("sum", function () {
    it("4*sum(float((-1)^k*(1/(2*k+1))),k,0,100)", function () {
        const lines: string[] = [
            `4*sum(float((-1)^k*(1/(2*k+1))),k,0,100)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "3.151493...");
        engine.release();
    });
});
