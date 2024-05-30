import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";

describe("eval", function () {
    it("eval(x+y,x,a,y,b)", function () {
        const lines: string[] = [`eval(x+y,x,a,y,b)`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b");
        engine.release();
    });
});
