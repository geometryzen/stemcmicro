import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";

// degree does not appear to be implemented in Algebrite either.
describe("degree", function () {
    xit("degree(x)", function () {
        const lines: string[] = [
            `degree(x)`
        ];
        const engine = createScriptEngine({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    xit("degree(x*x)", function () {
        const lines: string[] = [
            `degree(x*x)`
        ];
        const engine = createScriptEngine({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "");
        engine.release();
    });
    xit("degree(x**2)", function () {
        const lines: string[] = [
            `degree(x**2)`
        ];
        const engine = createScriptEngine({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "");
        engine.release();
    });
});
