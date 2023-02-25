import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";

describe("factor", function () {
    xit("factor(4)", function () {
        const lines: string[] = [
            `factor(4)`
        ];
        const engine = createScriptEngine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        // Expecting 2^2
        assert.strictEqual(engine.renderAsInfix(values[0]), "");
        engine.release();
    });
});
