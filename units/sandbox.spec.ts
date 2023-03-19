
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("integral(1/sqrt(a+x^2),x)", function () {
        const lines: string[] = [
            `integral(1/sqrt(a+x^2),x)`,
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({
            useCaretForExponentiation: true
        });

        const { values, errors } = context.executeScript(sourceText, {});
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "log(x+(a+x^2)^(1/2))");
        context.release();
    });
});
