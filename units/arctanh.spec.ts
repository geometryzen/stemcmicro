import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("arctanh", function () {
    it("arctanh(0)", function () {
        const lines: string[] = [
            `arctanh(0)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
});
