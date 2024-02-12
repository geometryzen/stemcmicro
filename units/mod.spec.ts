import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("mod", function () {
    it("mod", function () {
        const lines: string[] = [
            `mod(2.0,3.0)`
        ];
        const engine = create_script_context({
            dependencies: ['Flt']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "2.0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "2.0");
        engine.release();
    });
});
