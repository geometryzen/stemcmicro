import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("arccos", function () {
    it("arccos(1)", function () {
        const lines: string[] = [
            `arccos(1)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
});
