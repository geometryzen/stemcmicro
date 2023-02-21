import { assert } from "chai";
import { createScriptEngine } from "../index";

describe("sandbox", function () {
    it("(e1, e1)", function () {
        const lines: string[] = [
            `G11 = algebra([1, 1], ["L1", "L2"])`,
            `b1 = G11[1]`,
            `b2 = G11[2]`,
            `X = b1 + b1`,
            `X`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "2*L1");
        engine.release();
    });
});
