import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";

describe("subst", function () {
    it("001", function () {
        const lines: string[] = [
            `subst((-1)^(1/2),i,-3+10/9*3^(1/2)*i)`
        ];
        const engine = createScriptEngine({
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ -3 (* 10/9 (power 3 1/2) i))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "-3+10/9*3^(1/2)*i");
        engine.release();
    });
});
