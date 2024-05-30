import { assert_one_value_execute } from "./assert_one_value_execute";
import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";

describe("product", function () {
    it("A", function () {
        const lines: string[] = [`2*product(float((4*k^2)/(4*k^2-1)),k,1,100)`];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "3.133787...");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [`product(x+j,j,1,3)`];
        const sourceText = lines.join("\n");
        const context = create_script_context({
            useCaretForExponentiation: true
        });
        assert_one_value_execute(sourceText, context);
        const { values } = context.executeScript(sourceText);
        assert.strictEqual(context.renderAsInfix(values[0]), "6+11*x+6*x^2+x^3");
        context.release();
    });
});
