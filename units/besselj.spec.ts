import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";

describe("besselj", function () {
    it("besselj(0,0)", function () {
        const lines: string[] = [
            `besselj(0,0)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
});
