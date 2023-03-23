import { assert } from 'chai';
// Replace '../index' with 'jsxmath' in your code.
import { create_script_context } from '../index';

describe("algebra", function () {
    it("Native", function () {
        const lines: string[] = [
            `G11 = algebra([1, 1], ["1", "e1", "e2", "i"])`,
            `G11[1]`,
            `G11[2]`,
            `G11[1] ^ G11[2]`,
            `G11[1] | G11[1]`,
            `G11[1] | G11[2]`
        ];
        const context = create_script_context({});
        const { values } = context.executeScript(lines.join('\n'));
        assert.strictEqual(context.renderAsInfix(values[0]), "e1");
        assert.strictEqual(context.renderAsInfix(values[1]), "e2");
        assert.strictEqual(context.renderAsInfix(values[2]), "i");
        assert.strictEqual(context.renderAsInfix(values[3]), "1");
        assert.strictEqual(context.renderAsInfix(values[4]), "0");
        context.release();
    });
});
