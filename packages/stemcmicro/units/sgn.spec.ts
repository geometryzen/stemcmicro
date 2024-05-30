import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";

describe("sgn", function () {
    // Rat
    it("sgn(-3)", function () {
        const lines: string[] = [`sgn(-3)`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "-1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "-1");
        engine.release();
    });
    it("sgn(0)", function () {
        const lines: string[] = [`sgn(0)`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("sgn(3)", function () {
        const lines: string[] = [`sgn(3)`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    // Flt
    it("sgn(3.0)", function () {
        const lines: string[] = [`sgn(3.0)`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("sgn(-3.0)", function () {
        const lines: string[] = [`sgn(-3.0)`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "-1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "-1");
        engine.release();
    });
    it("sgn(0.0)", function () {
        const lines: string[] = [`sgn(0.0)`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    xit("sgn(a)", function () {
        const lines: string[] = [`sgn(a)`];
        const engine = create_script_context({
            assumes: {
                a: { real: false }
            }
        });
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "a/abs(a)");
        engine.release();
    });
    xit("sgn(a*b)", function () {
        const lines: string[] = [`sgn(a*b)`];
        const engine = create_script_context({
            assumes: {
                a: { real: false },
                b: { real: false }
            }
        });
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "a*b/(abs(a)*abs(b))");
        engine.release();
    });
    // The Rat should be able to inform how a Rat factor changes a product.
    // Ideally, it should not depend on the canonical ordering (just Rat in product)
    xit("sgn(5*b)", function () {
        const lines: string[] = [`sgn(5*b)`];
        const engine = create_script_context({
            assumes: {
                b: { real: false }
            }
        });
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "b/abs(b)");
        engine.release();
    });
    it("sgn(x+i*y)", function () {
        const lines: string[] = [`i=sqrt(-1)`, `sgn(x+i*y)`];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "x/((x^2+y^2)^(1/2))+i*y/((x^2+y^2)^(1/2))");
        engine.release();
    });
});
