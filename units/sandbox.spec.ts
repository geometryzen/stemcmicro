import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("metrics", function () {
    it("General", function () {
        const lines: string[] = [
            `G11 = algebra([g11, g22], ["i", "j"])`,
            `e1 = G11[1]`,
            `e2 = G11[2]`,
            `e2|e1`,
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
});
