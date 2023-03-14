
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("arg((-1)^(1/6)*exp(i*pi/6))", function () {
        const lines: string[] = [
            `autofactor=0`,
            `i=sqrt(-1)`,
            `pi=tau(1)/2`,
            `arg((-1)^(1/6)*exp(i*pi/6))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({ useCaretForExponentiation: true });

        const { values, errors } = context.executeScript(sourceText, {});
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "1/3*pi");
        context.release();
    });
});
