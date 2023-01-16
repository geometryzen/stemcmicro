import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";

describe("ceiling", function () {
    it("ceiling(4/2.0)", function () {
        const lines: string[] = [
            `ceiling(4/2.0)`
        ];
        const engine = createScriptEngine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "2.0");
        engine.release();
    });
    it("ceiling(5/2.0)", function () {
        const lines: string[] = [
            `ceiling(5/2.0)`
        ];
        const engine = createScriptEngine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "3.0");
        engine.release();
    });
});
