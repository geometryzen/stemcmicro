import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";

// TODO: Finish
describe("clearall", function () {
    xit("clear()", function () {
        const sourceText = [`clear(E)`].join("\n");
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const beginCount = engine.getSymbolsInfo().length;
        engine.executeScript("E=m*c^2");
        const endCount = engine.getSymbolsInfo().length;
        assert.strictEqual(endCount - beginCount, 1, "endCount-beginCount");
        const { values, prints } = engine.executeScript(sourceText);
        assert.strictEqual(engine.getSymbolsInfo().length, 1, "endCount-beginCount");
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 0, "values.length");
        assert.strictEqual(Array.isArray(prints), true);
        assert.strictEqual(prints.length, 0, "prints.length");
        engine.release();
    });
    xit("clearall", function () {
        const sourceText = [`clearall`].join("\n");
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const beginCount = engine.getSymbolsInfo().length;
        engine.executeScript("E=m*c^2");
        const endCount = engine.getSymbolsInfo().length;
        assert.strictEqual(endCount - beginCount, 1, "endCount-beginCount");
        const { values, prints } = engine.executeScript(sourceText);
        assert.strictEqual(engine.getSymbolsInfo().length, 1, "endCount-beginCount");
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 0, "values.length");
        assert.strictEqual(Array.isArray(prints), true);
        assert.strictEqual(prints.length, 0, "prints.length");
        engine.release();
    });
});
