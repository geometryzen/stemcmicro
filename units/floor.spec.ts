import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("floor", function () {
    it("3/2", function () {
        const lines: string[] = [
            `floor(3/2)`,
        ];
        const engine = create_script_context({
            dependencies: ['Flt']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
});
