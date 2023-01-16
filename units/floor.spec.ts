import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";

describe("floor", function () {
    it("3/2", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `floor(3/2)`,
        ];
        const engine = createScriptEngine({
            dependencies: ['Flt'],
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
});
