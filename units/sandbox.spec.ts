
import { assert } from "chai";
import { Directive } from "../src/env/ExtensionEnv";
import { create_script_context } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("???", function () {
        const lines: string[] = [
            `exp(1.0)`
        ];
        const engine = create_script_context({
            disable: [Directive.factor],
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "2.718282...");
        engine.release();
    });
});
