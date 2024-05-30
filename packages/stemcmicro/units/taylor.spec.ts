import assert from "assert";
import { Directive } from "../src/env/ExtensionEnv";
import { create_script_context } from "../src/runtime/script_engine";

describe("taylor", function () {
    it("taylor(1/(5+4*cos(x)),x,0,0)", function () {
        const lines: string[] = [`taylor(1/(5+4*cos(x)),x,0,0)`];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1/9");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/9");
        engine.release();
    });
    it("taylor(1/(5+4*cos(x)),x,1,0)", function () {
        const lines: string[] = [`taylor(1/(5+4*cos(x)),x,1,0)`];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1/9");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/9");
        engine.release();
    });
    xit("taylor(1/(5+4*cos(x)),x,2,0)", function () {
        const lines: string[] = [`taylor(1/(5+4*cos(x)),x,2,0)`];
        const engine = create_script_context({
            disable: [Directive.factoring],
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join("\n"));
        // assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ 1/9 (* 2/81 (pow x 2)))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/9+2/81*x**2");
        engine.release();
    });
    xit("taylor(1/(5+4*cos(x)),x,6,0)", function () {
        const lines: string[] = [`taylor(1/(5+4*cos(x)),x,6,0)`];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ 1/9 (* 2/81 (pow x 2)) (* 5/1458 (pow x 4)) (* 49/131220 (pow x 6)))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/9+2/81*x**2+5/1458*x**4+49/131220*x**6");
        engine.release();
    });
});
