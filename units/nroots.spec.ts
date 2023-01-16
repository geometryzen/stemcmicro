import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";

describe("nroots", function () {
    xit("nroots((1+i)*x^2+1)", function () {
        const lines: string[] = [
            `nroots((1+i)*x^2+1)`
        ];
        const engine = createScriptEngine({
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "4*sin(x)/((5+4*cos(x))*(5+4*cos(x)))");
        engine.release();
    });
});
