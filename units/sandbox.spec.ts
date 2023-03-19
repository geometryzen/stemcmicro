
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    xit("defint(a,y,-sqrt(1-x^2),sqrt(1-x^2),x,-1,1)", function () {
        const lines: string[] = [
            `defint(a,y,-sqrt(1-x^2),sqrt(1-x^2),x,-1,1)`,
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({
            autoExpand: true,
            autoFactor: true,
            useCaretForExponentiation: true
        });
        assert_one_value_execute(sourceText, context);

        const { values, errors } = context.executeScript(sourceText, {});
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "pi");
        context.release();
    });
});
