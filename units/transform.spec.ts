import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("transform", function () {
    it("a", function () {
        const lines: string[] = [
            `a`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "a");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a");
        engine.release();
    });
    it("a+b", function () {
        const lines: string[] = [
            `a+b`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ a b)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b");
        engine.release();
    });
    it("a+b+c", function () {
        const lines: string[] = [
            `a+b+c`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ a b c)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b+c");
        engine.release();
    });
    it("a", function () {
        const lines: string[] = [
            `a`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "a");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a");
        engine.release();
    });
    it("a+b", function () {
        const lines: string[] = [
            `a+b`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ a b)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b");
        engine.release();
    });
    it("a+b+c", function () {
        const lines: string[] = [
            `a+b+c`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ a b c)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b+c");
        engine.release();
    });
    it("1/a+1/b+1/c", function () {
        const lines: string[] = [
            `1/a+1/b+1/c`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (pow a -1) (pow b -1) (pow c -1))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/a+1/b+1/c");
        engine.release();
    });
    it("1/a", function () {
        const lines: string[] = [
            `1/a`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(pow a -1)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/a");
        engine.release();
    });
    it("foo(1/a)", function () {
        // BUG: Wrapping a reciprocal expression in a function causes an extra multiplication.
        const lines: string[] = [
            `foo(1/a)`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(foo (pow a -1))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "foo(1/a)");
        engine.release();
    });
    it("rationalize(1/a)", function () {
        const lines: string[] = [
            `rationalize(1/a)`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/a");
        engine.release();
    });
    it("rationalize(1/a+1/b)", function () {
        const lines: string[] = [
            `rationalize(1/a+1/b)`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "(a+b)/(a*b)");
        engine.release();
    });
    xit("rationalize(1/a+1/b+1/c)", function () {
        const lines: string[] = [
            `rationalize(1/a+1/b+1/c)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(sourceText);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "rationalize(1/a+1/b+1/c)");
        engine.release();
    });
});
