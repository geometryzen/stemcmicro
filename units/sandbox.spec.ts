import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("sequential keywords", function () {
        const sourceText = [
            `-sqrt(2)/2`,
        ].join('\n');
        const engine = create_script_engine({
            useCaretForExponentiation: true,
            useDefinitions: false
        });
        const { values, prints } = engine.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(engine.renderAsHuman(values[0]), "-1/2 2^(1/2)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "-1/2*2^(1/2)");
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* -1/2 (power 2 1/2))");
        assert.isArray(prints);
        assert.strictEqual(prints.length, 0, "prints.length");
        engine.release();
    });
    it("sequential keywords", function () {
        const sourceText = [
            `-sqrt(2)/2`,
            `printascii`,
            `printhuman`,
            `printinfix`,
            `printlatex`,
            `printsexpr`
        ].join('\n');
        const engine = create_script_engine({
            useCaretForExponentiation: true,
            useDefinitions: false
        });
        const { values, prints } = engine.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(engine.renderAsAscii(values[0]), "   1   1/2\n- --- 2\n   2");
        assert.strictEqual(engine.renderAsHuman(values[0]), "-1/2 2^(1/2)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "-1/2*2^(1/2)");
        assert.strictEqual(engine.renderAsLaTeX(values[0]), "-\\frac{\\sqrt{2}}{2}");
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* -1/2 (power 2 1/2))");
        assert.isArray(prints);
        assert.strictEqual(prints.length, 5, "prints.length");
        assert.strictEqual(prints[0], "   1   1/2\n- --- 2\n   2");
        assert.strictEqual(prints[1], "-1/2 2^(1/2)");
        assert.strictEqual(prints[2], "-1/2*2^(1/2)");
        assert.strictEqual(prints[3], "-\\frac{\\sqrt{2}}{2}");
        assert.strictEqual(prints[4], "(* -1/2 (power 2 1/2))");
        engine.release();
    });
});
