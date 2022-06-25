import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("lcm", function () {
    it("lcm(4,6)", function () {
        const lines: string[] = [
            `lcm(4,6)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "12");
        assert.strictEqual(engine.renderAsInfix(values[0]), "12");
        engine.release();
    });
});
