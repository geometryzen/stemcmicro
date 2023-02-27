import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("unit", function () {
    // This might be a generalization for argument of zero.
    /*
    it("unit(0)", function () {
        const lines: string[] = [
            `unit(0)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[]");
        assert.strictEqual(engine.renderAsInfix(values[0]), "[]");
        engine.release();
    });
    */
    it("unit(1)", function () {
        const lines: string[] = [
            `unit(1)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[[1]]");
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[1]]");
        assert.strictEqual(engine.renderAsLaTeX(values[0]), "\\begin{bmatrix} 1 \\end{bmatrix}");
        engine.release();
    });
    it("unit(2)", function () {
        const lines: string[] = [
            `unit(2)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[[1,0],[0,1]]");
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[1,0],[0,1]]");
        engine.release();
    });
    it("unit(3)", function () {
        const lines: string[] = [
            `unit(3)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[[1,0,0],[0,1,0],[0,0,1]]");
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[1,0,0],[0,1,0],[0,0,1]]");
        engine.release();
    });
    it("unit(4)", function () {
        const lines: string[] = [
            `unit(4)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]");
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]");
        engine.release();
    });
});
