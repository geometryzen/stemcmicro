import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";

describe("expand", function () {
    it("(a+b)*c", function () {
        const lines: string[] = [`(a+b)*c`];
        const sourceText = lines.join("\n");
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (* a c) (* b c))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a*c+b*c");
        engine.release();
    });
    it("(a+b+c)*d", function () {
        const lines: string[] = [`(a+b+c)*d`];
        const sourceText = lines.join("\n");
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (* a d) (* b d) (* c d))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a*d+b*d+c*d");
        engine.release();
    });
});
