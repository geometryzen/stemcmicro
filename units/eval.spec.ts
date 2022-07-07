import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("eval", function () {
    it("eval(x+y,x,a,y,b)", function () {
        const lines: string[] = [
            `eval(x+y,x,a,y,b)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b");
        engine.release();
    });
});
