
import { assert } from "chai";
import { SyntaxKind } from "../src/parser/parser";
import { create_script_context } from "../src/runtime/script_engine";

describe("arg", function () {
    it("arg(1)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(1)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "0");
        context.release();
    });
    it("arg(i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(i)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "pi");
        context.release();
    });
    it("arg(-1+0.1*i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(-1+0.1*i)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "3.041924...");
        context.release();
    });
    it("arg(-i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(-i)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "(* -1 pi)");
        context.release();
    });
    it("arg(1+i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(1+i)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "(* 1/4 pi)");
        context.release();
    });
    it("arg(-1+i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(-1+i)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "(* 3/4 pi)");
        context.release();
    });
    it("arg(1-i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(1-i)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "(* -1/4 pi)");
        context.release();
    });
    it("arg(-1-i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(-1-i)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "(* -3/4 pi)");
        context.release();
    });
});
