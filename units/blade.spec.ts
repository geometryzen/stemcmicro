import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("blade", function () {
    describe("abs", function () {
        it("Euclidean metric", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1], ["i", "j"])`,
                `e1 = G11[1]`,
                `e2 = G11[2]`,
                `abs(e1)`
            ];
            const engine = create_script_context({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "1");
            engine.release();
        });
    });
});
