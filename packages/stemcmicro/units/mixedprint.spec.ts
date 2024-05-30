import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";

describe("mixedprint", function () {
    xit("maxFixedPrintoutDigits should default to 6", function () {
        const sourceText = [`maxFixedPrintoutDigits`].join("\n");
        const engine = create_script_context();
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "6");
        engine.release();
    });
    xit("maxFixedPrintoutDigits is a binding that can be changed.", function () {
        const sourceText = [`maxFixedPrintoutDigits=20`, `maxFixedPrintoutDigits`].join("\n");
        const engine = create_script_context();
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "20");
        engine.release();
    });
    xit("maxFixedPrintoutDigits is a binding that can be changed.", function () {
        const sourceText = [`maxFixedPrintoutDigits=20`, `1.0*10^(-15)`].join("\n");
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "0.000000000000001");
        engine.release();
    });
    xit("maxFixedPrintoutDigits is the number of digits after the decimal (10e-15).", function () {
        const sourceText = [`maxFixedPrintoutDigits=10`, `1.0*10^(-15)`].join("\n");
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "0.0000000000...");
        engine.release();
    });
    xit("maxFixedPrintoutDigits is the number of digits after the decimal (pi).", function () {
        const sourceText = [`maxFixedPrintoutDigits=10`, `tau(1)/2`].join("\n");
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values, errors } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(errors), true);
        assert.strictEqual(errors.length, 0, "errors.length");
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(engine.renderAsInfix(values[0]), "pi");
        engine.release();
    });
    it("printhuman function", function () {
        const sourceText = [`printhuman(x*y)`].join("\n");
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values, prints } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 0);
        assert.strictEqual(Array.isArray(prints), true);
        assert.strictEqual(prints.length, 1);
        assert.strictEqual(prints[0], "x y");
        engine.release();
    });
    it("printhuman keyword", function () {
        const sourceText = [`1.0*10^(-15)`, `printhuman`].join("\n");
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values, prints } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "0.000000...");
        assert.strictEqual(Array.isArray(prints), true);
        assert.strictEqual(prints.length, 1);
        assert.strictEqual(prints[0], "0.000000...");
        engine.release();
    });
    it("printhuman keyword", function () {
        const sourceText = [`x*y`, `printhuman`].join("\n");
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values, prints } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsHuman(values[0]), "x y");
        // assert.strictEqual(engine.renderAsInfix(values[0]), "x*y");
        assert.strictEqual(Array.isArray(prints), true);
        assert.strictEqual(prints.length, 1);
        assert.strictEqual(prints[0], "x y");
        engine.release();
    });
    it("printsexpr function", function () {
        const sourceText = [`printsexpr(x*y)`].join("\n");
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values, prints } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 0);
        assert.strictEqual(Array.isArray(prints), true);
        assert.strictEqual(prints.length, 1);
        assert.strictEqual(prints[0], "(* x y)");
        engine.release();
    });
    it("printsexpr keyword", function () {
        const sourceText = [`x*y`, `printsexpr`].join("\n");
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values, prints } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(Array.isArray(prints), true);
        assert.strictEqual(prints.length, 1);
        assert.strictEqual(prints[0], "(* x y)");
        engine.release();
    });
    it("printinfix keyword", function () {
        const sourceText = [`1.0*10^(-15)`, `printinfix`].join("\n");
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values, prints } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "0.000000...");
        assert.strictEqual(Array.isArray(prints), true);
        assert.strictEqual(prints.length, 1);
        assert.strictEqual(prints[0], "0.000000...");
        engine.release();
    });
    it("printinfix keyword", function () {
        const sourceText = [`a+b`, `printinfix`].join("\n");
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values, prints } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsHuman(values[0]), "a + b");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b");
        assert.strictEqual(Array.isArray(prints), true);
        assert.strictEqual(prints.length, 1);
        assert.strictEqual(prints[0], "a+b");
        engine.release();
    });
    it("sequential keywords I", function () {
        const sourceText = [`a+b`, `printascii`, `printhuman`, `printinfix`, `printlatex`, `printsexpr`].join("\n");
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values, prints } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(engine.renderAsAscii(values[0]), "a + b");
        assert.strictEqual(engine.renderAsHuman(values[0]), "a + b");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b");
        assert.strictEqual(engine.renderAsLaTeX(values[0]), "a+b");
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ a b)");
        assert.strictEqual(Array.isArray(prints), true);
        assert.strictEqual(prints.length, 5, "prints.length");
        assert.strictEqual(prints[0], "a + b");
        assert.strictEqual(prints[1], "a + b");
        assert.strictEqual(prints[2], "a+b");
        assert.strictEqual(prints[3], "a+b");
        assert.strictEqual(prints[4], "(+ a b)");
        engine.release();
    });
    it("sequential keywords II", function () {
        const sourceText = [`a*b`, `printascii`, `printhuman`, `printinfix`, `printlatex`, `printsexpr`].join("\n");
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values, prints } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(engine.renderAsAscii(values[0]), "a b");
        assert.strictEqual(engine.renderAsHuman(values[0]), "a b");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a*b");
        assert.strictEqual(engine.renderAsLaTeX(values[0]), "ab");
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* a b)");
        assert.strictEqual(Array.isArray(prints), true);
        assert.strictEqual(prints.length, 5, "prints.length");
        assert.strictEqual(prints[0], "a b");
        assert.strictEqual(prints[1], "a b");
        assert.strictEqual(prints[2], "a*b");
        assert.strictEqual(prints[3], "ab");
        assert.strictEqual(prints[4], "(* a b)");
        engine.release();
    });
    it("ascii", function () {
        const sourceText = [`-sqrt(2)/2`, `printascii`, `printhuman`, `printinfix`, `printlatex`, `printsexpr`].join("\n");
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values, prints } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(engine.renderAsAscii(values[0]), "   1   1/2\n- --- 2\n   2");
        assert.strictEqual(engine.renderAsHuman(values[0]), "-1/2 2^(1/2)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "-1/2*2^(1/2)");
        assert.strictEqual(engine.renderAsLaTeX(values[0]), "-\\frac{\\sqrt{2}}{2}");
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* -1/2 (pow 2 1/2))");
        assert.strictEqual(Array.isArray(prints), true);
        assert.strictEqual(prints.length, 5, "prints.length");
        assert.strictEqual(prints[0], "   1   1/2\n- --- 2\n   2");
        assert.strictEqual(prints[1], "-1/2 2^(1/2)");
        assert.strictEqual(prints[2], "-1/2*2^(1/2)");
        assert.strictEqual(prints[3], "-\\frac{\\sqrt{2}}{2}");
        assert.strictEqual(prints[4], "(* -1/2 (pow 2 1/2))");
        engine.release();
    });
});
