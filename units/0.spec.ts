import { assert } from 'chai';
import { createScriptEngine } from '../src/runtime/script_engine';

describe("0", function () {
    it("B", function () {
        const lines: string[] = [
            `2 + 3`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useDefinitions: true });
        const { values } = engine.executeScript(sourceText);
        const value = values[0];
        assert.strictEqual(engine.renderAsInfix(value), "5");
        engine.release();
    });
});
