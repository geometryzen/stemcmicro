import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";

describe("laguerre", function () {
    it("laguerre(x,0)", function () {
        const lines: string[] = [
            `laguerre(x,0)`
        ];
        const engine = createScriptEngine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("laguerre(x,1)", function () {
        const lines: string[] = [
            `laguerre(x,1)`
        ];
        const engine = createScriptEngine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ 1 (* -1 x))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1-x");
        engine.release();
    });
    xit("laguerre(x,2)", function () {
        const lines: string[] = [
            `laguerre(x,2)`
        ];
        const engine = createScriptEngine({
            disable: ['factorize']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ 1 (* -2 x) (* 1/2 (* x x)))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1-2*x+1/2*x*x");
        engine.release();
    });
});
