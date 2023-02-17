import { assert } from "chai";
import { createScriptEngine, ImplicateTransformer, NoopTransformer } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("foo(1/a), NoopTransformer", function () {
        // BUG: Wrapping a reciprocal expression in a function causes an extra multiplication.
        const lines: string[] = [
            `foo(1/a)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const { values } = engine.transformScript(lines.join('\n'), new NoopTransformer());
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        // We're using a NoopTransformer so it would appear to be the result of parsing.
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(foo (power a -1))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "foo(1/a)");
        engine.release();
    });
    xit("foo(1/a), NoopTransformer", function () {
        // BUG: Wrapping a reciprocal expression in a function causes an extra multiplication.
        const lines: string[] = [
            `foo(1/a)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const { values } = engine.transformScript(lines.join('\n'), new NoopTransformer());
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        // We're using a NoopTransformer so it would appear to be the result of parsing.
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(foo (* 1 (power a -1)))"); // WRONG
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(foo (power a -1))"); // RIGHT
        assert.strictEqual(engine.renderAsInfix(values[0]), "foo(1/a)");
        engine.release();
    });
    xit("foo(1/a)", function () {
        // BUG: Wrapping a reciprocal expression in a function causes an extra multiplication.
        const lines: string[] = [
            `foo(1/a)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const { values } = engine.transformScript(lines.join('\n'), new ImplicateTransformer());
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(foo (* 1 (power a -1)))"); // WRONG
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(foo (power a -1))"); // RIGHT
        assert.strictEqual(engine.renderAsInfix(values[0]), "foo(1/a)");
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
});
