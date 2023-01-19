import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("rationalize", function () {
    it("rationalize(a/b+c/d)", function () {
        const lines: string[] = [
            `rationalize(a/b+c/d)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* (+ (* a d) (* b c)) (power (* b d) -1))");
        assert.strictEqual(engine.renderAsInfix(actual), "(a*d+b*c)/(b*d)");

        engine.release();
    });
    it("rationalize(a/b+b/a)", function () {
        const lines: string[] = [
            `rationalize(a/b+b/a)`
        ];
        const engine = createScriptEngine({
            disable: ['factorize'],
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* (+ (power a 2) (power b 2)) (power (* a b) -1))");
        assert.strictEqual(engine.renderAsInfix(actual), "(a^2+b^2)/(a*b)");

        engine.release();
    });
});