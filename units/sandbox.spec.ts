
import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("x+a*x", function () {
        const lines: string[] = [
            `factor(100!)`,
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
        assert.strictEqual(context.renderAsInfix(values[0]), "2^97*3^48*5^24*7^16*11^9*13^7*17^5*19^5*23^4*29^3*31^3*37^2*41^2*43^2*47^2*53*59*61*67*71*73*79*83*89*97");
        context.release();
    });
    xit("x+a*x", function () {
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
