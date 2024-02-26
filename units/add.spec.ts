import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("add", function () {
    it("Flt+Rat", function () {
        // The trouble begins when the symbol is one of the special values... s,t,x,y,z in src/bake.ts
        const lines: string[] = [
            `2.0+3`
        ];
        const engine = create_script_context({
            dependencies: ['Flt']
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), '5.0');
        // assert.strictEqual(engine.toListString(actual), '');
        engine.release();
    });
    it("Rat+Flt", function () {
        // The trouble begins when the symbol is one of the special values... s,t,x,y,z in src/bake.ts
        const lines: string[] = [
            `2+3.0`
        ];
        const engine = create_script_context({
            dependencies: ['Flt']
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), '5.0');
        // assert.strictEqual(engine.toListString(actual), '');
        engine.release();
    });
    it("a+b", function () {
        const lines: string[] = [
            `a+b`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ a b)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b");
        engine.release();
    });
    it("b+a", function () {
        const lines: string[] = [
            `b+a`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ a b)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b");
        engine.release();
    });
    it("a+b+c", function () {
        const lines: string[] = [
            `a+b+c`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ a b c)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b+c");
        engine.release();
    });
    it("b+a+c", function () {
        const lines: string[] = [
            `b+a+c`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ a b c)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b+c");
        engine.release();
    });
    it("a+b+b+a", function () {
        const lines: string[] = [
            `a+b+b+a`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (* 2 a) (* 2 b))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "2*a+2*b");
        engine.release();
    });
    it("a+b+c+c+b+a", function () {
        const lines: string[] = [
            `a+b+c+c+b+a`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context({ useCaretForExponentiation: true });
        const { values } = engine.executeScript(sourceText);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (* 2 a) (* 2 b) (* 2 c))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "2*a+2*b+2*c");
        engine.release();
    });
    it("x^2+(-x^2)", function () {
        const lines: string[] = [
            `x^2+(-x^2)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("1/(b*(a+b*x))+1/(-a*b-x*b^2)", function () {
        const lines: string[] = [
            `1/(b*(a+b*x))+1/(-a*b-x*b^2)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
});
