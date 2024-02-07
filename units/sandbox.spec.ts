
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("sandbox", function () {
    xit("abs(exp(a+i*b))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `abs(exp(a+i*b))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(context.simplify(values[0])), "exp(a)");
        context.release();
    });
});