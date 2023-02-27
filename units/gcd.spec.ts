import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("gcd", function () {
    it("gcd(30,42)", function () {
        const lines: string[] = [
            `gcd(30,42)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "6");
        assert.strictEqual(engine.renderAsInfix(values[0]), "6");
        engine.release();
    });
});
