
import { assert } from "chai";
import { create_script_context } from "../index";
import { Directive } from "../src/env/ExtensionEnv";

describe("sandbox", function () {
    it("???", function () {
        const lines: string[] = [
            `(x+3)**2`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({
            enable: [Directive.expandPowSum]
        });

        const { values, errors } = context.executeScript(sourceText, {});
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "9+6*x+x**2");
        context.release();
    });
});