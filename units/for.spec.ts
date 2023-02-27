import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("for", function () {
    it("for", function () {
        const lines: string[] = [
            `x=0`,
            `y=2`,
            `for(do(x=sqrt(2+x),y=2*y/x), k,1,9)`,
            `float(y)`
        ];
        const engine = create_script_engine({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "3.141588...");
        engine.release();
    });
});
