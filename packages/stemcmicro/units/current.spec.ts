import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";

describe("current", function () {
    it("numerator(1/(x-1)/(x-2))", function () {
        const lines: string[] = [`numerator(1/(x-1)/(x-2))`];
        const engine = create_script_context({
            dependencies: [],
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        engine.release();
    });
});
