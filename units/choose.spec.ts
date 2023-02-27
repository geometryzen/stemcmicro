import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("choose", function () {
    it("choose(n,k)", function () {
        const lines: string[] = [
            `choose(n,k)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "n!/(k!*(-k+n)!)");
        engine.release();
    });
});
