import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("arccosh", function () {
    it("arccosh(1)", function () {
        const lines: string[] = [
            `arccosh(1)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
});
