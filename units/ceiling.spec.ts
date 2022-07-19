import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("ceiling", function () {
    it("ceiling(4/2.0)", function () {
        const lines: string[] = [
            `ceiling(4/2.0)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "2.0");
        engine.release();
    });
    it("ceiling(5/2.0)", function () {
        const lines: string[] = [
            `ceiling(5/2.0)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "3.0");
        engine.release();
    });
});
