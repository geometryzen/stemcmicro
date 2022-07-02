import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("choose", function () {
    it("choose(n,k)", function () {
        const lines: string[] = [
            `choose(n,k)`
        ];
        const engine = create_engine({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* (factorial n) (power (factorial k) -1) (power (factorial (+ (* -1 k) n)) -1))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "n!/(k!*(-k+n)!)");
        engine.release();
    });
});
