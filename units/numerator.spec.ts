import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("numerator", function () {
    it("numerator(2/3)", function () {
        const lines: string[] = [
            `numerator(2/3)`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "2");
        assert.strictEqual(engine.renderAsInfix(actual), "2");

        engine.release();
    });
    it("numerator(x)", function () {
        const lines: string[] = [
            `numerator(x)`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "x");
        assert.strictEqual(engine.renderAsInfix(actual), "x");

        engine.release();
    });
    it("numerator(1/x)", function () {
        const lines: string[] = [
            `numerator(1/x)`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "1");
        assert.strictEqual(engine.renderAsInfix(actual), "1");

        engine.release();
    });
    it("numerator(a+b)", function () {
        const lines: string[] = [
            `numerator(a+b)`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b)");
        assert.strictEqual(engine.renderAsInfix(actual), "a+b");

        engine.release();
    });
    it("numerator(1/(1/a)", function () {
        const lines: string[] = [
            `numerator(1/(1/a))`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "a");
        assert.strictEqual(engine.renderAsInfix(actual), "a");

        engine.release();
    });
    xit("numerator(1/a+1/b)", function () {
        const lines: string[] = [
            `numerator(1/a+1/b)`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b)");
        assert.strictEqual(engine.renderAsInfix(actual), "a+b");

        engine.release();
    });
    it("numerator(1/(x-1)/(x-2))", function () {
        const lines: string[] = [
            `numerator(1/(x-1)/(x-2))`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "1");
        assert.strictEqual(engine.renderAsInfix(actual), "1");

        engine.release();
    });
});
