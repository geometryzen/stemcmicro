import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("approxration", function () {
    it("approxratio(a*3.14)", function () {
        const lines: string[] = [
            `approxratio(a*3.14)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        // assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "22/7*a");
        engine.release();
    });
});
