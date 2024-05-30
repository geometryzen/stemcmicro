import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";

describe("iscomplex", function () {
    it("iscomplex(z)", function () {
        const lines: string[] = [`iscomplex(z)`];
        const sourceText = lines.join("\n");

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "true");
        assert.strictEqual(context.renderAsInfix(values[0]), "true");
        context.release();
    });
});
