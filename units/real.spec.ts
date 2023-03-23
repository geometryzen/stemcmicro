import { assert } from "chai";
import { create_script_context } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("real", function () {
    it("re(z)", function () {
        const lines: string[] = [
            `re(z)`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "z");
        engine.release();
    });
    it("re(z) when z is not real", function () {
        const lines: string[] = [
            `re(z)`
        ];
        const engine = create_script_context({
            assumes: {
                'z': { real: false }
            },
            dependencies: ['Imu'],
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "re(z)");
        engine.release();
    });
    xit("re(i*z) when z is not real", function () {
        const lines: string[] = [
            `re(i*z)`
        ];
        const engine = create_script_context({
            assumes: {
                'z': { real: false }
            },
            dependencies: ['Imu'],
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "-im(z)");
        engine.release();
    });
    it("exp(x*i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `re(exp(x*i))`
        ];
        const engine = create_script_context({
            dependencies: ['Imu']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(cos x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(x)");
        engine.release();
    });
    it("re(x+i*y) => x, when variables are assumed to be real.", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `re(x+i*y)`
        ];
        const engine = create_script_context({
            dependencies: ['Imu']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "x");
        engine.release();
    });
    xit("re(x+i*y) => re(x)+re(i*y), when variables may be complex", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `re(x+i*y)`
        ];
        const engine = create_script_context({
            assumes: {
                'x': { real: false },
                'y': { real: false }
            },
            dependencies: ['Imu']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "re(x)+re(i*y)");
        engine.release();
    });
    xit("re(exp(i*x)) => cos(x)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `re(exp(i*x))`
        ];
        const engine = create_script_context({
            dependencies: ['Imu']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(cos x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(x)");
        engine.release();
    });
    xit("", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `re(1/(x+i*y))`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "x/(x^2+y^2)");
        engine.release();
    });
    it("re(log(i))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `re(log(i))`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0");
        engine.release();
    });
    it("clock(re(log(i)))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `clock(re(log(clock(i))))`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0");
        engine.release();
    });
    it("re(i*log(3))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `re(i*log(3))`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("re((-1)^(1/3))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `re((-1)^(1/3))`,
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false,
            useCaretForExponentiation: true
        });
        const { values } = context.executeScript(sourceText, {});
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "1/2");
        context.release();
    });
    it("re(exp(i*x))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `re(exp(i*x))`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useCaretForExponentiation: false,
            useDefinitions: false
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Can this be presented better?
        assert.strictEqual(engine.renderAsInfix(actual), "cos(x)");
        engine.release();
    });
    it("re(exp(a*i*x))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `re(exp(a*i*x))`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useCaretForExponentiation: false,
            useDefinitions: false
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Can this be presented better?
        assert.strictEqual(engine.renderAsInfix(actual), "cos(a*x)");
        engine.release();
    });
    it("re(exp(i))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `re(exp(i))`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useCaretForExponentiation: false,
            useDefinitions: false
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Can this be presented better?
        assert.strictEqual(engine.renderAsInfix(actual), "cos(1)");
        engine.release();
    });
});
