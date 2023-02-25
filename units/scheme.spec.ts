import { assert } from 'chai';
import { createSchemeEngine } from '../src/scheme/scheme_engine';

describe("scheme", function () {
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
});
