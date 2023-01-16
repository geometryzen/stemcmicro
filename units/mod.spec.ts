import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";

describe("mod", function () {
    it("mod", function () {
        const lines: string[] = [
            `mod(2.0,3.0)`
        ];
        const engine = createScriptEngine({
            dependencies: ['Flt']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "2");
        assert.strictEqual(engine.renderAsInfix(values[0]), "2");
        engine.release();
    });
});
