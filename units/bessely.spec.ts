import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";

describe("bessely", function () {
    it("bessely(x,n)", function () {
        const lines: string[] = [
            `bessely(x,n)`
        ];
        const engine = createScriptEngine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(bessely x n)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "bessely(x,n)");
        engine.release();
    });
});
