import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("laguerre", function () {
    xit("laguerre(x,0)", function () {
        const lines: string[] = [
            `laguerre(x,0)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    xit("laguerre(x,1)", function () {
        const lines: string[] = [
            `laguerre(x,1)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ 1 (* -1 x))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1-x");
        engine.release();
    });
    it("laguerre(x,2)", function () {
        const lines: string[] = [
            `implicate=1`,
            `laguerre(x,2)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ 1 (* -2 x) (* 1/2 (power x 2)))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1-2*x+1/2*x**2");
        engine.release();
    });
});
