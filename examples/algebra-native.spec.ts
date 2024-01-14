import { assert } from 'chai';
import { create_script_context } from '../src/runtime/script_engine';
// TODO: This is no longer the API we are exposing.
describe("algebra", function () {
    it("Native", function () {
        const sourceText = [
            `G11 = algebra([1, 1], ["1", "e1", "e2", "i"])`,
            `G11[1]`,
            `G11[2]`,
            `G11[1] ^ G11[2]`,
            `G11[1] | G11[1]`,
            `G11[1] | G11[2]`
        ].join('\n');
        const context = create_script_context();
        const { values } = context.executeScript(sourceText);

        assert.strictEqual(context.renderAsInfix(values[0]), "e1");
        assert.strictEqual(context.renderAsInfix(values[1]), "e2");
        assert.strictEqual(context.renderAsInfix(values[2]), "i");
        assert.strictEqual(context.renderAsInfix(values[3]), "1");
        assert.strictEqual(context.renderAsInfix(values[4]), "0");

        context.release();
    });
});

