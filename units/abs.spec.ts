import { assert } from "chai";
import { Directive } from "../src/env/ExtensionEnv";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("abs", function () {
    it("abs(x)", function () {
        const lines: string[] = [
            `abs(x)`,
        ];
        const engine = create_script_context({
            assumes: {
                'x': { real: false }
            }
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "abs(x)");
        engine.release();
    });
    it("abs(i*y)", function () {
        const lines: string[] = [
            `abs(i*y)`,
        ];
        const engine = create_script_context({
            assumes: {
                'y': { real: false }
            },
            useDefinitions: true
        });
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
        assert.strictEqual(engine.renderAsSExpr(value), "(pow (+ (pow x 2) (pow y 2)) 1/2)");
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
        assert.strictEqual(engine.renderAsInfix(value), "(a**2+b**2)**(1/2)");
        engine.release();
    });
    it("abs(a+b+i*c)", function () {
        const lines: string[] = [
            `abs(a+b+i*c)`,
        ];
        const engine = create_script_context({
            enable: [Directive.expandPowSum],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "(2*a*b+a**2+b**2+c**2)**(1/2)");
        engine.release();
    });
    it("abs(a+b+i*c)", function () {
        const lines: string[] = [
            `abs(a+b+i*c)`,
        ];
        const engine = create_script_context({
            disable: [Directive.expandPowSum],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "(c**2+(a+b)**2)**(1/2)");
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
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (pow x 2) (pow y 2))");
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
            assumes: {
                'x': { real: false },
                'y': { real: false }
            },
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
            assumes: {
                'x': { real: false }
            },
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
            enable: [Directive.expandPowSum],
            useCaretForExponentiation: false,
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
    it("(-1)^(1/2)*0.0", function () {
        const lines: string[] = [
            `(-1)^(1/2)*0.0`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0.0");
        engine.release();
    });
    it("0.0*(-1)^(1/2)", function () {
        const lines: string[] = [
            `0.0*(-1)^(1/2)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0.0");
        engine.release();
    });
    it("1.0*(-1)^(1/2)", function () {
        const lines: string[] = [
            `1.0*(-1)^(1/2)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1.0*i");
        engine.release();
    });
    xit("1+1.0*(-1)^(1/2)", function () {
        const lines: string[] = [
            `1+1.0*(-1)^(1/2)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1.0+1.0*i");
        engine.release();
    });
    it("abs(1+1.0*(-1)^(1/2))", function () {
        const lines: string[] = [
            `abs(1+1.0*(-1)^(1/2))`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1.414214...");
        engine.release();
    });
    it("rendering", function () {
        const lines: string[] = [
            `abs(x)`,
        ];
        const engine = create_script_context({
            assumes: {
                'x': { real: false }
            }
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsAscii(value), "abs(x)");
        assert.strictEqual(engine.renderAsHuman(value), "abs(x)");
        assert.strictEqual(engine.renderAsInfix(value), "abs(x)");
        assert.strictEqual(engine.renderAsLaTeX(value), "\\left |x \\right |");
        assert.strictEqual(engine.renderAsSExpr(value), "(abs x)");
        engine.release();
    });
    it("abs(exp(i*x))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `abs(exp(i*x))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "1");
        context.release();
    });
    it("abs(exp(a+i*b))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `abs(exp(a+i*b))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "exp(a)");
        context.release();
    });
    it("abs(1^a)", function () {
        const lines: string[] = [
            `abs(1^a)`,
        ];
        const engine = create_script_context({ useDefinitions: true, useCaretForExponentiation: true });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1");
        engine.release();
    });
    it("abs(a/b)", function () {
        const lines: string[] = [
            `abs(a/b)`
        ];
        const engine = create_script_context({
            assumes: {
                'a': { real: false },
                'b': { real: false }
            },
            useDefinitions: true,
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "abs(a)/abs(b)");
        engine.release();
    });
});
