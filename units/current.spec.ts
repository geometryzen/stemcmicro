import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("current", function () {
    it("numerator(1/(x-1)/(x-2))", function () {
        const lines: string[] = [
            `numerator(1/(x-1)/(x-2))`
        ];
        const engine = create_engine({
            dependencies: [],
            useDefinitions: false,
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        engine.release();
    });
});
