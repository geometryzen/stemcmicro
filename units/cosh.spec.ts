import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("cosh", function () {
    it("cosh(0)", function () {
        const lines: string[] = [
            `cosh(0)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
});
