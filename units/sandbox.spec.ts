import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("metrics", function () {
    it("General", function () {
        const lines: string[] = [
            `G11 = algebra([g11, g22,g33], ["i", "j","k"])`,
            `e1 = G11[1]`,
            `e2 = G11[2]`,
            `e3 = G11[3]`,
            `e3|e3`,
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "g33");
        engine.release();
    });
});
