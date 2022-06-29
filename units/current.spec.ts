import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("current", function () {
    it("division", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=1`,
            `(((10+30*x**2)+40*x**3)+20*x)/(x**3)`
        ];
        const engine = create_engine({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (* 10 (power x -3)) (* 20 (power x -2)) (* 30 (power x -1)) 40)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "10/(x**3)+20/(x**2)+30/x+40");
        // Algebrite...
        // assert.strictEqual(engine.renderAsInfix(values[0]), "40+10/(x^3)+20/(x^2)+30/x");
        engine.release();
    });
});
