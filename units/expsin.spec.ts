import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

xdescribe("expsin", function () {
    it("expsin(x)", function () {
        const lines: string[] = [
            `expsin(x)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/2*(-exp(x*i)+exp(-x*i))*i");
        engine.release();
    });
});
