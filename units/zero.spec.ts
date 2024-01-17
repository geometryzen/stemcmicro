import { assert } from "chai";
import { SyntaxKind } from "../src/parser/parser";
import { create_script_context } from "../src/runtime/script_engine";

describe("zero", function () {
    it("zero(1,1)", function () {
        const lines: string[] = [
            `zero(1,1)`
        ];
        const context = create_script_context({
            syntaxKind: SyntaxKind.Algebrite
        });
        const { values } = context.executeScript(lines.join('\n'));
        assert.strictEqual(context.renderAsSExpr(values[0]), "[[0]]");
        assert.strictEqual(context.renderAsInfix(values[0]), "[[0]]");
        context.release();
    });
    it("zero(2,2)", function () {
        const lines: string[] = [
            `zero(2,2)`
        ];
        const context = create_script_context({
        });
        const { values } = context.executeScript(lines.join('\n'));
        assert.strictEqual(context.renderAsSExpr(values[0]), "[[0,0],[0,0]]");
        assert.strictEqual(context.renderAsInfix(values[0]), "[[0,0],[0,0]]");
        context.release();
    });
});
