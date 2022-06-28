import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("current", function () {
    /*
    it("hermite(x,2)", function () {
        const lines: string[] = [
            `hermite(x,2)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ -2 (* 4 (power x 2)))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "-2+4*x**2");
        engine.release();
    });
    */
    it("hermite(x,3)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `hermite(x,3)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (* -12 x) (* 8 (power x 3)))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "-12*x+8*x**3");
        engine.release();
    });
});
