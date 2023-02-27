import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("tanh", function () {
    it("tanh(0)", function () {
        const lines: string[] = [
            `tanh(0)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
});
