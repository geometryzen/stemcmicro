import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";

describe("d", function () {
    it("d(1/(5+4*cos(x)),x)", function () {
        const lines: string[] = [
            `d(1/(5+4*cos(x)),x)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false,
            useDerivativeShorthandLowerD: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "4*sin(x)/(25+40*cos(x)+16*cos(x)**2)");
        engine.release();
    });
});
