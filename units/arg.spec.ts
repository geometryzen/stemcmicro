import { assert } from "chai";
import { create_script_context, SyntaxKind } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

//
// Using concrete complex numbers to test the handling of the various quadrants.
// https://en.wikipedia.org/wiki/Argument_(complex_analysis) 
//
describe("arg", function () {
    it("arg(0)", function () {
        const lines: string[] = [
            `arg(0)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "undefined");
        context.release();
    });
    it("arg(0.0)", function () {
        const lines: string[] = [
            `arg(0.0)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "undefined");
        context.release();
    });
    it("arg(1)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(1)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "0");
        context.release();
    });
    it("arg(i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(i)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "(* 1/2 pi)");
        context.release();
    });
    it("arg(-1+0.1*i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(-1+0.1*i)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "3.041924...");
        context.release();
    });
    it("arg(-i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(-i)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "(* -1/2 pi)");
        context.release();
    });
    it("arg(1+i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(1+i)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "(* 1/4 pi)");
        context.release();
    });
    it("arg(-1+i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(-1+i)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "(* 3/4 pi)");
        context.release();
    });
    it("arg(1-i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(1-i)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "(* -1/4 pi)");
        context.release();
    });
    it("arg(-1-i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(-1-i)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.Native });
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "(* -3/4 pi)");
        context.release();
    });
});

describe("arg", function () {
    xit("arg(a)", function () {
        const lines: string[] = [
            `arg(a)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "arg(a)");
        engine.release();
    });
    xit("arg(a/b)", function () {
        const lines: string[] = [
            `arg(a/b)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "arg(a)-arg(b)");
        engine.release();
    });
    it("arg(x+i*y)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(x+i*y)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "arctan(y/x)");
        engine.release();
    });
    xit("arg((a+i*b)/(c+i*d))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg((a+i*b)/(c+i*d))`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "arctan(a/b)-arctan(c/d)");
        engine.release();
    });
    // FIXME
    xit("arg(exp(i*pi/3))", function () {
        const lines: string[] = [
            `arg(exp(i*pi/3))`,
        ];
        const engine = create_script_context({
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/3*pi");
        engine.release();
    });
    it("arg((-1)**(1/3))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `arg((-1)**(1/3))`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/3*pi");
        engine.release();
    });
    xit("float(arg((-1)**(1/3)))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `float(arg((-1)**(1/3)))`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1.047198...");
        engine.release();
    });
    it("float(1/3*pi)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `float(1/3*pi)`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1.047198...");
        engine.release();
    });
    it("arg(1+exp(i*pi/3))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `arg(1+exp(i*pi/3))`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/6*pi");
        engine.release();
    });
    it("arg(abs(a)*exp(b+i*pi/5))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `arg(abs(a)*exp(b+i*pi/5))`,
        ];
        const engine = create_script_context({
            assumes: {
                'a': { real: false },
                'b': { real: true }
            },
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/5*pi");
        engine.release();
    });
    xit("arg(abs(a)*exp(b+i*pi/5))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `arg(abs(a)*exp(b+i*pi/5))`,
        ];
        const engine = create_script_context({
            assumes: {
                'a': { real: true },
                'b': { real: true }
            },
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/5*pi");
        engine.release();
    });
    it("arg((-1)^(1/6)*exp(i*pi/6))", function () {
        const lines: string[] = [
            `autofactor=0`,
            `i=sqrt(-1)`,
            `pi=tau(1)/2`,
            `arg((-1)^(1/6)*exp(i*pi/6))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({ useCaretForExponentiation: true });

        const { values, errors } = context.executeScript(sourceText, {});
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "1/3*pi");
        context.release();
    });
});
