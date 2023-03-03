import { assert } from "chai";
import { ScriptKind } from "../src/parser/parser";
import { create_script_context } from "../src/runtime/script_engine";

describe("typhon", function () {
    it("137", function () {
        const lines: string[] = [
            `137`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            scriptKind: ScriptKind.PY,
            useCaretForExponentiation: false
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 0, "values.length");
        // assert.strictEqual(context.renderAsInfix(values[0]), "0");
        context.release();
    });
});
