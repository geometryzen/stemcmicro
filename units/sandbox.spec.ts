
import { assert } from "chai";
import { create_script_context } from "../index";

describe("sandbox", function () {
    it("???", function () {
        const lines: string[] = [
            `(x+3)**2`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "(3+x)**2");
        context.release();
    });
});