import { assert } from 'chai';
import { ScriptKind } from '../src/parser/parser';
import { create_script_context } from '../src/runtime/script_engine';

describe("scripts", function () {
    describe("addition", function () {
        it("Eigenmath", function () {
            const lines: string[] = [
                `x+y`
            ];
            const sourceText = lines.join('\n');
            const context = create_script_context({
                scriptKind: ScriptKind.Eigenmath
            });
            const { values } = context.executeScript(sourceText);
            assert.isArray(values);
            assert.strictEqual(values.length, 1, "values.length");
            assert.strictEqual(context.renderAsAscii(values[0]), `x + y`);
            assert.strictEqual(context.renderAsHuman(values[0]), `x + y`);
            assert.strictEqual(context.renderAsInfix(values[0]), `x+y`);
            assert.strictEqual(context.renderAsLaTeX(values[0]), `x+y`);
            assert.strictEqual(context.renderAsSExpr(values[0]), `(+ x y)`);
            context.release();
        });
        it("Python", function () {
            const lines: string[] = [
                `x+y`
            ];
            const sourceText = lines.join('\n');
            const context = create_script_context({
                scriptKind: ScriptKind.Python
            });
            const { values } = context.executeScript(sourceText);
            assert.isArray(values);
            assert.strictEqual(values.length, 1, "values.length");
            assert.strictEqual(context.renderAsAscii(values[0]), `x + y`);
            assert.strictEqual(context.renderAsHuman(values[0]), `x + y`);
            assert.strictEqual(context.renderAsInfix(values[0]), `x+y`);
            assert.strictEqual(context.renderAsLaTeX(values[0]), `x+y`);
            assert.strictEqual(context.renderAsSExpr(values[0]), `(+ x y)`);
            context.release();
        });
        it("Scheme", function () {
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
            assert.strictEqual(context.renderAsAscii(values[0]), `x + y`);
            assert.strictEqual(context.renderAsHuman(values[0]), `x + y`);
            assert.strictEqual(context.renderAsInfix(values[0]), `x+y`);
            assert.strictEqual(context.renderAsLaTeX(values[0]), `x+y`);
            assert.strictEqual(context.renderAsSExpr(values[0]), `(+ x y)`);
            context.release();
        });
    });
    describe("multiplication", function () {
        it("Eigenmath", function () {
            const lines: string[] = [
                `x*y`
            ];
            const sourceText = lines.join('\n');
            const context = create_script_context({
                scriptKind: ScriptKind.Eigenmath
            });
            const { values } = context.executeScript(sourceText);
            assert.isArray(values);
            assert.strictEqual(values.length, 1, "values.length");
            assert.strictEqual(context.renderAsAscii(values[0]), `x y`);
            assert.strictEqual(context.renderAsHuman(values[0]), `x y`);
            assert.strictEqual(context.renderAsInfix(values[0]), `x*y`);
            assert.strictEqual(context.renderAsLaTeX(values[0]), `xy`);
            assert.strictEqual(context.renderAsSExpr(values[0]), `(* x y)`);
            context.release();
        });
        it("Python", function () {
            const lines: string[] = [
                `x*y`
            ];
            const sourceText = lines.join('\n');
            const context = create_script_context({
                scriptKind: ScriptKind.Python
            });
            const { values } = context.executeScript(sourceText);
            assert.isArray(values);
            assert.strictEqual(values.length, 1, "values.length");
            assert.strictEqual(context.renderAsAscii(values[0]), `x y`);
            assert.strictEqual(context.renderAsHuman(values[0]), `x y`);
            assert.strictEqual(context.renderAsInfix(values[0]), `x*y`);
            assert.strictEqual(context.renderAsLaTeX(values[0]), `xy`);
            assert.strictEqual(context.renderAsSExpr(values[0]), `(* x y)`);
            context.release();
        });
        it("Scheme", function () {
            const lines: string[] = [
                `(* x y)`
            ];
            const sourceText = lines.join('\n');
            const context = create_script_context({
                scriptKind: ScriptKind.Scheme
            });
            const { values } = context.executeScript(sourceText);
            assert.isArray(values);
            assert.strictEqual(values.length, 1, "values.length");
            assert.strictEqual(context.renderAsAscii(values[0]), `x y`);
            assert.strictEqual(context.renderAsHuman(values[0]), `x y`);
            assert.strictEqual(context.renderAsInfix(values[0]), `x*y`);
            assert.strictEqual(context.renderAsLaTeX(values[0]), `xy`);
            assert.strictEqual(context.renderAsSExpr(values[0]), `(* x y)`);
            context.release();
        });
    });
});
