import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("(b/a)^2", function () {
        const sourceText = [
            `(b/a)^2`,
        ].join('\n');
        const engine = create_script_engine({
            useCaretForExponentiation: true,
            useDefinitions: false
        });
        const { values, prints } = engine.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(engine.renderAsInfix(values[0]), "b^2/(a^2)");
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* (power a -2) (power b 2))");
        assert.isArray(prints);
        assert.strictEqual(prints.length, 0, "prints.length");
        engine.release();
    });
});
