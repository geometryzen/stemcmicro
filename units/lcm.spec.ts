import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";

describe("lcm", function () {
    it("lcm(4,6)", function () {
        const lines: string[] = [
            `lcm(4,6)`
        ];
        const engine = createScriptEngine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "12");
        assert.strictEqual(engine.renderAsInfix(values[0]), "12");
        engine.release();
    });
});
