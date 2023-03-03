import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("abs", function () {
    it("abs(x)", function () {
        const lines: string[] = [
            `abs(x)`,
        ];
        const engine = create_script_context({});
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "abs(x)");
        engine.release();
    });
    xit("abs(x)", function () {
        const lines: string[] = [
            `abs(x)`,
        ];
        const engine = create_script_context({});
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "(x**2)**(1/2)");
        engine.release();
    });
    it("abs(i*y)", function () {
        const lines: string[] = [
            `abs(i*y)`,
        ];
        const engine = create_script_context({ useDefinitions: true });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "abs(y)");
        engine.release();
    });
    it("abs(x+i*y)", function () {
        const lines: string[] = [
            `abs(x+i*y)`,
        ];
        const engine = create_script_context({
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "(x**2+y**2)**(1/2)");
        engine.release();
    });
    it("abs(a+i*b)", function () {
        const lines: string[] = [
            `abs(a+i*b)`,
        ];
        const engine = create_script_context({
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(power (+ (power a 2) (power b 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "(a**2+b**2)**(1/2)");
        engine.release();
    });
    it("abs(a+b+i*c)", function () {
        const lines: string[] = [
            `abs(a+b+i*c)`,
        ];
        const engine = create_script_context({
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "(2*a*b+a**2+b**2+c**2)**(1/2)");
        engine.release();
    });
    it("x * i", function () {
        const lines: string[] = [
            `prettyfmt=0`,
            `i=sqrt(-1)`,
            `x * i`,
        ];
        const engine = create_script_context({ useDefinitions: false });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "i*x");
        engine.release();
    });
    it("-i * i * x * x", function () {
        const lines: string[] = [
            `prettyfmt=0`,
            `i=sqrt(-1)`,
            `-i * i * x * x`,
        ];
        const engine = create_script_context({
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x**2");
        engine.release();
    });
    it("(x-i*y)*(x+i*y)", function () {
        const lines: string[] = [
            `(x-i*y)*(x+i*y)`,
        ];
        const engine = create_script_context({
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (power x 2) (power y 2))");
        assert.strictEqual(engine.renderAsInfix(value), "x**2+y**2");
        engine.release();
    });
    it("abs(1+2.0*i)", function () {
        // FIXME
        const lines: string[] = [
            `i=sqrt(-1)`,
            `abs(1+2.0*i)`,
        ];
        const engine = create_script_context({
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "2.236068...");
        assert.strictEqual(engine.renderAsInfix(value), "2.236068...");
        engine.release();
    });
    it("exp(i*pi/3)", function () {
        const lines: string[] = [
            `exp(i*pi/3)`,
        ];
        const engine = create_script_context({
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/2+1/2*i*3**(1/2)");
        engine.release();
    });
    it("abs(x*y)", function () {
        const lines: string[] = [
            `abs(x*y)`
        ];
        const engine = create_script_context({
            useDefinitions: true,
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        // assert.strictEqual(engine.renderAsSExpr(values[0]), "(abs x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "abs(x)*abs(y)");
        engine.release();
    });
    it("abs(x)*abs(x)", function () {
        const lines: string[] = [
            `abs(x)*abs(x)`
        ];
        const engine = create_script_context({
            useDefinitions: true,
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "x**2");
        engine.release();
    });
    it("abs(x*i)", function () {
        const lines: string[] = [
            `abs(x*i)`
        ];
        const engine = create_script_context({
            useDefinitions: true,
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        // assert.strictEqual(engine.renderAsSExpr(values[0]), "(abs x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "abs(x)");
        engine.release();
    });
    it("abs(a+b+c*i)", function () {
        const lines: string[] = [
            `abs(a+b+c*i)`,
        ];
        const engine = create_script_context({
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "(2*a*b+a**2+b**2+c**2)**(1/2)");
        engine.release();
    });
    it("abs((1/3)^(1/2))", function () {
        const lines: string[] = [
            `abs((1/3)^(1/2))`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1/3^(1/2)");
        engine.release();
    });
});
