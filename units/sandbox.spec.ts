
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("x+a*x", function () {
        const lines: string[] = [
            `x+a*x`,
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({
            autoExpand: true,
            autoFactor: true
        });

        const { values, errors } = context.executeScript(sourceText, {});
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "x*(1+a)");
        context.release();
    });
});
