
import { assert } from "chai";
import { Directive } from "../src/env/ExtensionEnv";
import { create_script_context } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("1/(-a*b-x*b^2)+1/(a*b+x*b^2)", function () {
        const lines: string[] = [
            `1/(-a*b-x*b^2)+1/(a*b+x*b^2)`
        ];
        const engine = create_script_context({
            disables: [Directive.factor],
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("1/(b*(a+b*x))+1/(-a*b-x*b^2)", function () {
        const lines: string[] = [
            `1/(b*(a+b*x))+1/(-a*b-x*b^2)`
        ];
        const engine = create_script_context({
            disables: [Directive.factor],
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
});
