import assert from 'assert';
import { create_script_context } from '../src/runtime/script_engine';

describe("scripts", function () {
    describe("addition", function () {
        it("Eigenmath", function () {
            const lines: string[] = [
                `x+y`
            ];
            const sourceText = lines.join('\n');
            const context = create_script_context({});
            const { values } = context.executeScript(sourceText);
            assert.strictEqual(Array.isArray(values), true);
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
            const context = create_script_context({});
            const { values } = context.executeScript(sourceText);
            assert.strictEqual(Array.isArray(values), true);
            assert.strictEqual(values.length, 1, "values.length");
            assert.strictEqual(context.renderAsAscii(values[0]), `x y`);
            assert.strictEqual(context.renderAsHuman(values[0]), `x y`);
            assert.strictEqual(context.renderAsInfix(values[0]), `x*y`);
            assert.strictEqual(context.renderAsLaTeX(values[0]), `xy`);
            assert.strictEqual(context.renderAsSExpr(values[0]), `(* x y)`);
            context.release();
        });
    });
    describe("math.exp", function () {
        xit("Eigenmath", function () {
            const lines: string[] = [
                `exp(x,y)`,
                `float(exp(1))`
            ];
            const sourceText = lines.join('\n');
            const context = create_script_context({
                useCaretForExponentiation: true
            });
            const { values } = context.executeScript(sourceText);
            assert.strictEqual(Array.isArray(values), true);
            assert.strictEqual(values.length, 2, "values.length");
            assert.strictEqual(context.renderAsAscii(values[0]), `exp(x,y)`);
            assert.strictEqual(context.renderAsHuman(values[0]), `exp(x,y)`);
            assert.strictEqual(context.renderAsInfix(values[0]), `exp(x,y)`);
            assert.strictEqual(context.renderAsLaTeX(values[0]), `exp(x,y)`);
            assert.strictEqual(context.renderAsSExpr(values[0]), `(exp x y)`);
            assert.strictEqual(context.renderAsInfix(values[1]), `2.718282...`);
            context.release();
        });
    });
    describe("exponentiation", function () {
        it("Eigenmath", function () {
            const lines: string[] = [
                `x^y`
            ];
            const sourceText = lines.join('\n');
            const context = create_script_context({
                useCaretForExponentiation: true
            });
            const { values } = context.executeScript(sourceText);
            assert.strictEqual(Array.isArray(values), true);
            assert.strictEqual(values.length, 1, "values.length");
            assert.strictEqual(context.renderAsAscii(values[0]), ` y\nx`);
            assert.strictEqual(context.renderAsHuman(values[0]), `x^y`);
            assert.strictEqual(context.renderAsInfix(values[0]), `x^y`);
            assert.strictEqual(context.renderAsLaTeX(values[0]), `x^y`);
            assert.strictEqual(context.renderAsSExpr(values[0]), `(pow x y)`);
            context.release();
        });
    });
});
