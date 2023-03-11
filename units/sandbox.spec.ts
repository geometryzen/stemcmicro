
import { assert } from "chai";
import { SyntaxKind } from "../src/parser/parser";
import { create_script_context } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("isreal(i^(4/1)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `isreal(i**(4/1))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "#t");
        assert.strictEqual(context.renderAsInfix(values[0]), "true");
        context.release();
    });
    it("isreal(i^(3/2)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `isreal(i**(3/2))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "#f");
        assert.strictEqual(context.renderAsInfix(values[0]), "false");
        context.release();
    });
    it("isreal(i**(4/3)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `isreal(i**(4/3))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "#f");
        assert.strictEqual(context.renderAsInfix(values[0]), "false");
        context.release();
    });
    it("isreal(x^(3/2)", function () {
        const lines: string[] = [
            `isreal(x**(3/2))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "#t");
        assert.strictEqual(context.renderAsInfix(values[0]), "true");
        context.release();
    });
});
