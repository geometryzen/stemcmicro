import assert from 'assert';
import { create_script_context } from '../src/runtime/script_engine';

describe("0", function () {
    it("B", function () {
        console.log("0.spec.ts");
        const lines: string[] = [
            `2 + 3`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context();
        const { values } = engine.executeScript(sourceText);
        const value = values[0];
        assert.strictEqual(engine.renderAsInfix(value), "5");
        engine.release();
    });
});
