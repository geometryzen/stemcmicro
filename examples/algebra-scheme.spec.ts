import { assert } from 'chai';
// Replace '../index' with 'jsxmath' in your code.
import { create_script_context, SyntaxKind } from '../index';

describe("algebra", function () {
    xit("Scheme", function () {
        const sourceText = [
            // TODO: How do we construct a tensor?
            `(= G11 (algebra [1, 1] ["1", "e1", "e2", "i"])`,
            `(componnet G11 1)`,
            `(component G11 2)`,
            `(^ (component G11 1) (component G11 2))`,
            `(| (component G11 1) (component G11 1))`,
            `(| (component G11 1) (component G11 2))`
        ].join('\n');
        const context = create_script_context({ syntaxKind: SyntaxKind.Scheme });
        const { values } = context.executeScript(sourceText);

        assert.strictEqual(context.renderAsInfix(values[0]), "e1");
        assert.strictEqual(context.renderAsInfix(values[1]), "e2");
        assert.strictEqual(context.renderAsInfix(values[2]), "i");
        assert.strictEqual(context.renderAsInfix(values[3]), "1");
        assert.strictEqual(context.renderAsInfix(values[4]), "0");

        context.release();
    });
});
