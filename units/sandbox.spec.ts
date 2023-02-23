import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    xit("1", function () {
        const lines: string[] = [
            `i|(j+k)`,
        ];
        const engine = createScriptEngine({
            treatAsVectors: ['i', 'j', 'k'],
            useCaretForExponentiation: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(engine.renderAsSExpr(value), "???");
        assert.strictEqual(engine.renderAsInfix(value), "i|j+i|k");
        engine.release();
    });
    it("1", function () {
        const lines: string[] = [
            `(i+j)|k`,
        ];
        const engine = createScriptEngine({
            treatAsVectors: ['i', 'j', 'k'],
            useCaretForExponentiation: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (| i k) (| j k))");
        assert.strictEqual(engine.renderAsInfix(value), "i|k+j|k");
        engine.release();
    });
});
