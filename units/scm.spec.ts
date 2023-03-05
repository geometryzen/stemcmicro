import { assert } from 'chai';
import { ScriptKind } from '../src/parser/parser';
import { create_script_context } from '../src/runtime/script_engine';

xdescribe("scheme", function () {
    xit("123", function () {
        const lines: string[] = [
            `123`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            scriptKind: ScriptKind.Scheme
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        // TODO: Should be x + y
        assert.strictEqual(context.renderAsInfix(values[0]), `123`);
        context.release();
    });
    xit("(+ x y)", function () {
        const lines: string[] = [
            `(+ x y)`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            scriptKind: ScriptKind.Scheme
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
            scriptKind: ScriptKind.Scheme
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsInfix(values[0]), `(+ 3 4)`);
        context.release();
    });
});
