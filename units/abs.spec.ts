import assert from 'assert';
import { Directive } from "../src/env/ExtensionEnv";
import { stemc_prolog } from "../src/runtime/init";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("abs", function () {
    xit("abs(x)", function () {
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
    xit("abs(i*y)", function () {
        const lines: string[] = [
            `abs(i*y)`,
        ];
        const engine = create_script_context({
            assumes: {
                'y': { real: false }
            },
            prolog: stemc_prolog
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
            prolog: stemc_prolog
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(pow (+ (pow x 2) (pow y 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "(x**2+y**2)**(1/2)");
        engine.release();
    });
    xit("abs(a+i*b)", function () {
        const lines: string[] = [
            `abs(a+i*b)`,
        ];
        const engine = create_script_context({
            prolog: stemc_prolog
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "(a**2+b**2)**(1/2)");
        engine.release();
    });
    xit("abs(a+b+i*c)", function () {
        const lines: string[] = [
            `abs(a+b+i*c)`,
        ];
        const engine = create_script_context({
            enable: [Directive.expandPowSum],
            prolog: stemc_prolog
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "(2*a*b+a**2+b**2+c**2)**(1/2)");
        engine.release();
    });
    xit("abs(a+b+i*c)", function () {
        const lines: string[] = [
            `abs(a+b+i*c)`,
        ];
        const engine = create_script_context({
            disable: [Directive.expandPowSum],
            prolog: stemc_prolog
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "(c**2+(a+b)**2)**(1/2)");
        engine.release();
    });
    xit("x * i", function () {
        const lines: string[] = [
            `prettyfmt=0`,
            `i=sqrt(-1)`,
            `x * i`,
        ];
        const engine = create_script_context({});
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "i*x");
        engine.release();
    });
    xit("-i * i * x * x", function () {
        const lines: string[] = [
            `prettyfmt=0`,
            `i=sqrt(-1)`,
            `-i * i * x * x`,
        ];
        const engine = create_script_context({

        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x**2");
        engine.release();
    });
    xit("(x-i*y)*(x+i*y)", function () {
        const lines: string[] = [
            `(x-i*y)*(x+i*y)`,
        ];
        const engine = create_script_context({
            prolog: stemc_prolog
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (pow x 2) (pow y 2))");
        assert.strictEqual(engine.renderAsInfix(value), "x**2+y**2");
        engine.release();
    });
    xit("abs(1+2.0*i)", function () {
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
    xit("exp(i*pi/3)", function () {
        const lines: string[] = [
            `exp(i*pi/3)`,
        ];
        const engine = create_script_context({
            prolog: stemc_prolog
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/2+1/2*3**(1/2)*i");
        engine.release();
    });
    xit("abs(x*y)", function () {
        const lines: string[] = [
            `abs(x*y)`
        ];
        const engine = create_script_context({
            assumes: {
                'x': { real: false },
                'y': { real: false }
            },
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        // assert.strictEqual(engine.renderAsSExpr(values[0]), "(abs x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "abs(x)*abs(y)");
        engine.release();
    });
    xit("abs(x)*abs(x)", function () {
        const lines: string[] = [
            `abs(x)*abs(x)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "x**2");
        engine.release();
    });
    xit("abs(x*i)", function () {
        const lines: string[] = [
            `abs(x*i)`
        ];
        const engine = create_script_context({
            assumes: {
                'x': { real: false }
            },
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        // assert.strictEqual(engine.renderAsSExpr(values[0]), "(abs x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "abs(x)");
        engine.release();
    });
    xit("abs(a+b+c*i)", function () {
        const lines: string[] = [
            `abs(a+b+c*i)`,
        ];
        const engine = create_script_context({
            enable: [Directive.expandPowSum],
            prolog: stemc_prolog,
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "(2*a*b+a**2+b**2+c**2)**(1/2)");
        engine.release();
    });
    xit("abs((1/3)^(1/2))", function () {
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
    xit("(-1)^(1/2)*0.0", function () {
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
    xit("0.0*(-1)^(1/2)", function () {
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
    xit("1.0*(-1)^(1/2)", function () {
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
    xit("abs(1+1.0*(-1)^(1/2))", function () {
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
    xit("rendering", function () {
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
    xit("abs(exp(i*x))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `abs(exp(i*x))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.strictEqual(Array.isArray(errors), true);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "1");
        context.release();
    });
    xit("abs(exp(a+i*b))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `abs(exp(a+i*b))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.strictEqual(Array.isArray(errors), true);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(context.simplify(values[0])), "exp(a)");
        context.release();
    });
    xit("abs(1^a)", function () {
        const lines: string[] = [
            `abs(1^a)`,
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1");
        engine.release();
    });
    xit("abs(a/b)", function () {
        const lines: string[] = [
            `abs(a/b)`
        ];
        const engine = create_script_context({
            assumes: {
                'a': { real: false },
                'b': { real: false }
            },
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "abs(a)/abs(b)");
        engine.release();
    });
});
