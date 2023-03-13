import { assert } from "chai";
import { SyntaxKind } from "../src/parser/parser";
import { create_script_context } from "../src/runtime/script_engine";

describe("iscomplex", function () {
    it("iscomplex(z)", function () {
        const lines: string[] = [
            `iscomplex(z)`
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