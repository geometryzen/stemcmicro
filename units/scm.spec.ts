import { assert } from 'chai';
import { SyntaxKind } from '../src/parser/parser';
import { create_script_context } from '../src/runtime/script_engine';

describe("scheme", function () {
    it("123", function () {
        const lines: string[] = [
            `123`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.Scheme
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        // TODO: Should be x + y
        assert.strictEqual(context.renderAsInfix(values[0]), `123`);
        context.release();
    });
    it("(+ x y)", function () {
        const lines: string[] = [
            `(+ x y)`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.Scheme
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        // TODO: Should be x + y
        assert.strictEqual(context.renderAsInfix(values[0]), `x+y`);
        context.release();
    });
    it("(quote (+ 3 4))", function () {
        const lines: string[] = [
            `(quote (+ 3 4))`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.Scheme
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `(+ 3 4)`);
        assert.strictEqual(context.renderAsInfix(values[0]), `3+4`);
        context.release();
    });
    it("(real? 1901)", function () {
        const lines: string[] = [
            `(real? 1901)`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.Scheme
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `#t`);
        assert.strictEqual(context.renderAsInfix(values[0]), `true`);
        context.release();
    });
    it("(real? 3.0)", function () {
        const lines: string[] = [
            `(real? 3.0)`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.Scheme
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `#t`);
        assert.strictEqual(context.renderAsInfix(values[0]), `true`);
        context.release();
    });
});
