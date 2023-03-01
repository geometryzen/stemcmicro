import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("sequential keywords", function () {
        const sourceText = [
            `a+b`,
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
        assert.strictEqual(engine.renderAsAscii(values[0]), "a + b");
        assert.strictEqual(engine.renderAsHuman(values[0]), "a + b");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b");
        assert.strictEqual(engine.renderAsLaTeX(values[0]), "a+b");
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ a b)");
        assert.isArray(prints);
        assert.strictEqual(prints.length, 5, "prints.length");
        assert.strictEqual(prints[0], "a + b");
        assert.strictEqual(prints[1], "a + b");
        assert.strictEqual(prints[2], "a+b");
        assert.strictEqual(prints[3], "a+b");
        assert.strictEqual(prints[4], "(+ a b)");
        engine.release();
    });
});
