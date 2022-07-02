import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("taylor", function () {
    it("taylor(1/(5+4*cos(x)),x,0,0)", function () {
        const lines: string[] = [
            `taylor(1/(5+4*cos(x)),x,0,0)`
        ];
        const engine = create_engine({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1/9");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/9");
        engine.release();
    });
    it("taylor(1/(5+4*cos(x)),x,1,0)", function () {
        const lines: string[] = [
            `taylor(1/(5+4*cos(x)),x,1,0)`
        ];
        const engine = create_engine({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1/9");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/9");
        engine.release();
    });
    it("taylor(1/(5+4*cos(x)),x,2,0)", function () {
        const lines: string[] = [
            `taylor(1/(5+4*cos(x)),x,2,0)`
        ];
        const engine = create_engine({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ 1/9 (* 2/81 (power x 2)))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/9+2/81*x**2");
        engine.release();
    });
    xit("taylor(1/(5+4*cos(x)),x,6,0)", function () {
        const lines: string[] = [
            `taylor(1/(5+4*cos(x)),x,6,0)`
        ];
        const engine = create_engine({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ 1/9 (* 2/81 (power x 2)) (* 5/1458 (power x 4)) (* 49/131220 (power x 6)))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/9+2/81*x**2+5/1458*x**4+49/131220*x**6");
        engine.release();
    });
});
