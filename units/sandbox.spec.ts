
import { assert } from "chai";
import { SyntaxKind } from "../src/parser/parser";
import { create_script_context } from "../src/runtime/script_engine";

describe("arg", function () {
    it("arg(0)", function () {
        const lines: string[] = [
            `arg(0)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "undefined");
        context.release();
    });
    it("arg(0.0)", function () {
        const lines: string[] = [
            `arg(0.0)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "undefined");
        context.release();
    });
});
