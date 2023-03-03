import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("tau(1)", function () {
        const sourceText = [
            `tau(1)`
        ].join('\n');
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values, errors } = engine.executeScript(sourceText);
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0, "errors.length");
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(engine.renderAsInfix(values[0]), "2*pi");
        engine.release();
    });
    it("float(tau(1))", function () {
        const sourceText = [
            `float(tau(1))`
        ].join('\n');
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values, errors } = engine.executeScript(sourceText);
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0, "errors.length");
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(engine.renderAsInfix(values[0]), "6.283185...");
        engine.release();
    });
    it("float(tau(1)/2)", function () {
        const sourceText = [
            `float(tau(1)/2)`
        ].join('\n');
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values, errors } = engine.executeScript(sourceText);
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0, "errors.length");
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(engine.renderAsInfix(values[0]), "3.141593...");
        engine.release();
    });
    it("float(tau(1)/2)", function () {
        const sourceText = [
            `maxFixedPrintoutDigits=10`,
            `float(tau(1)/2)`
        ].join('\n');
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values, errors } = engine.executeScript(sourceText);
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0, "errors.length");
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(engine.renderAsInfix(values[0]), "3.1415926536...");
        engine.release();
    });
});
