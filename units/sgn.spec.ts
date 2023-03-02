import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("sgn", function () {
    // Rat
    it("sgn(-3)", function () {
        const lines: string[] = [
            `sgn(-3)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "-1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "-1");
        engine.release();
    });
    it("sgn(0)", function () {
        const lines: string[] = [
            `sgn(0)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    // Flt
    it("sgn(3.0)", function () {
        const lines: string[] = [
            `sgn(3.0)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("sgn(-3.0)", function () {
        const lines: string[] = [
            `sgn(-3.0)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "-1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "-1");
        engine.release();
    });
    it("sgn(0.0)", function () {
        const lines: string[] = [
            `sgn(0.0)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("sgn(3)", function () {
        const lines: string[] = [
            `sgn(3)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("sgn(a*b)", function () {
        const lines: string[] = [
            `sgn(a*b)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(sgn (* a b))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "sgn(a*b)");
        engine.release();
    });
    // The Rat should be able to inform how a Rat factor changes a product.
    // Ideally, it should not depend on the canonical ordering (just Rat in product)
    it("sgn(5*b)", function () {
        const lines: string[] = [
            `sgn(5*b)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(sgn b)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "sgn(b)");
        engine.release();
    });
});
