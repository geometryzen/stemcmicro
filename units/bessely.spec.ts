import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";

describe("bessely", function () {
    it("bessely(x,n)", function () {
        const lines: string[] = [
            `bessely(x,n)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(bessely x n)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "bessely(x,n)");
        engine.release();
    });
});
