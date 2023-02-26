import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";
//  x^4 - 10*x^3 + 21*x^2 + 40*x - 100 => [-2,2,5]
describe("roots", function () {
    it("roots(x)", function () {
        const lines: string[] = [
            `roots(x)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[0]");
        engine.release();
    });
    it("roots(2^x-y,y)", function () {
        const lines: string[] = [
            `roots(2^x-y,y)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[2^x]");
        engine.release();
    });
    it("roots(x^2)", function () {
        const lines: string[] = [
            `roots(x^2)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[0]");
        engine.release();
    });
    it("roots(x^3)", function () {
        const lines: string[] = [
            `roots(x^3)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[0]");
        engine.release();
    });
    it("roots(2*x)", function () {
        const lines: string[] = [
            `roots(2*x)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[0]");
        engine.release();
    });
    it("roots(2*x^2)", function () {
        const lines: string[] = [
            `roots(2*x^2)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[0]");
        engine.release();
    });
    it("roots(2*x^3)", function () {
        const lines: string[] = [
            `roots(2*x^3)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[0]");
        engine.release();
    });
    it("roots(i*x^2-13*i*x+36*i)", function () {
        const lines: string[] = [
            `roots(i*x^2-13*i*x+36*i)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[4,9]");
        engine.release();
    });
    it("roots(6+11*x+6*x^2+x^3)", function () {
        const lines: string[] = [
            `roots(6+11*x+6*x^2+x^3)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[-3,-2,-1]");
        engine.release();
    });
    it("roots(x^4 - 10*x^3 + 21*x^2 + 40*x - 100)", function () {
        const lines: string[] = [
            `roots(x^4 - 10*x^3 + 21*x^2 + 40*x - 100)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[-2,2,5]");
        engine.release();
    });
    it("roots(x-a,x)", function () {
        const lines: string[] = [
            `roots(x-a,x)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[a]");
        engine.release();
    });
    xit("roots(a*x^2+b*x+c)", function () {
        const lines: string[] = [
            `roots(a*x^2+b*x+c)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[-1/2*(b^2/(a^2)-4*c/a)^(1/2)-b/(2*a),1/2*(b^2/(a^2)-4*c/a)^(1/2)-b/(2*a)]");
        engine.release();
    });
    xit("roots(a*x**2+b*x+c)", function () {
        const lines: string[] = [
            `roots(a*x**2+b*x+c)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: false });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b)");
        assert.strictEqual(engine.renderAsInfix(actual), "a+b");
        engine.release();
    });
});
