import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("rationalize", function () {
    it("rationalize(1/a)", function () {
        const lines: string[] = [
            `rationalize(1/a)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(power a -1)");
        assert.strictEqual(engine.renderAsInfix(actual), "1/a");
        engine.release();
    });
    it("rationalize(1/a+1/b)", function () {
        const lines: string[] = [
            `rationalize(1/a+1/b)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(engine.renderAsSExpr(actual), "(* (+ a b) (power (* a b) -1))");
        assert.strictEqual(engine.renderAsInfix(actual), "(a+b)/(a*b)");
        engine.release();
    });
    xit("rationalize(1/a+1/b+1/c)", function () {
        const lines: string[] = [
            `rationalize(1/a+1/b+1/c)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(engine.renderAsSExpr(actual), "");
        assert.strictEqual(engine.renderAsInfix(actual), "(a*b+a*c+b*c)/(a*b*c)");
        engine.release();
    });
    xit("rationalize(a/b+c/d)", function () {
        const lines: string[] = [
            `rationalize(a/b+c/d)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(engine.renderAsSExpr(actual), "(* (+ (* a d) (* b c)) (power (* b d) -1))");
        assert.strictEqual(engine.renderAsInfix(actual), "(a*d+b*c)/(b*d)");
        engine.release();
    });
    xit("rationalize(a/b+b/a)", function () {
        const lines: string[] = [
            `rationalize(a/b+b/a)`
        ];
        const engine = createScriptEngine({
            disable: ['factorize'],
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(engine.renderAsSExpr(actual), "(* (+ (power a 2) (power b 2)) (power (* a b) -1))");
        assert.strictEqual(engine.renderAsInfix(actual), "(a^2+b^2)/(a*b)");
        engine.release();
    });
});