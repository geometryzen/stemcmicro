import { assert } from 'chai';
import { createScriptEngine } from '../src/runtime/script_engine';
import { createSchemeEngine } from '../src/scheme/scheme_engine';

describe("0", function () {
    xit("A", function () {
        const lines: string[] = [
            `(+ 2 3)`
        ];
        const sourceText = lines.join('\n');
        const engine = createSchemeEngine();
        const { values } = engine.executeScript(sourceText);
        const value = values[0];
        assert.strictEqual(engine.renderAsSExpr(value), "(+ x y)");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [
            `2 + 3`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine();
        const { values } = engine.executeScript(sourceText);
        const value = values[0];
        assert.strictEqual(engine.renderAsInfix(value), "5");
        engine.release();
    });
});
