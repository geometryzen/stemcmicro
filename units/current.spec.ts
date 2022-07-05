import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("current", function () {
    it("d(1/(5+4*cos(x)),x)", function () {
        const lines: string[] = [
            `d(1/(5+4*cos(x)),x)`
        ];
        const engine = create_engine({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "4*sin(x)/((5+4*cos(x))*(5+4*cos(x)))");
        engine.release();
    });
});
