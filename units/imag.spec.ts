import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("imag", function () {
    it("im(a)", function () {
        const lines: string[] = [
            `im(a)`
        ];
        const engine = create_script_context({
            dependencies: ['Imu']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("im(i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `im(i)`
        ];
        const engine = create_script_context({
            dependencies: ['Imu']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("im(i*y)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `im(i*y)`
        ];
        const engine = create_script_context({
            dependencies: ['Imu']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "y");
        assert.strictEqual(engine.renderAsInfix(values[0]), "y");
        engine.release();
    });
    it("im(a+i*b)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `im(a+i*b)`
        ];
        const engine = create_script_context({
            dependencies: ['Imu']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "b");
        assert.strictEqual(engine.renderAsInfix(values[0]), "b");
        engine.release();
    });
    xit("im(x+i*y)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `im(x+i*y)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "y");
        engine.release();
    });
    xit("im(1/(x+i*y))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `im(1/(x+i*y))`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-y/(x^2+y^2)");
        engine.release();
    });
    it("im((-1)^(1/3))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `im((-1)^(1/3))`,
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
        assert.strictEqual(context.renderAsInfix(values[0]), "1/2*3^(1/2)");
        context.release();
    });
    it("im((-1)^(1/6))", function () {
        const lines: string[] = [
            `autofactor=0`,
            `i=sqrt(-1)`,
            `pi=tau(1)/2`,
            `im((-1)^(1/6))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({ useCaretForExponentiation: true });

        const { values, errors } = context.executeScript(sourceText, {});
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "1/2");
        context.release();
    });
    it("im((-1)^(1/6)*3^(1/2))", function () {
        const lines: string[] = [
            `autofactor=0`,
            `i=sqrt(-1)`,
            `pi=tau(1)/2`,
            `im((-1)^(1/6)*3^(1/2))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({ useCaretForExponentiation: true });

        const { values, errors } = context.executeScript(sourceText, {});
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "1/2*3^(1/2)");
        context.release();
    });
    it("im(1/(a+i*b))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `im(1/(a+i*b))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({ useCaretForExponentiation: true });

        const { values, errors } = context.executeScript(sourceText, {});
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "-b/(a^2+b^2)");
        context.release();
    });
    it("im(exp(i*x))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `im(exp(i*x))`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useCaretForExponentiation: false,
            useDefinitions: false
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Can this be presented better?
        assert.strictEqual(engine.renderAsInfix(actual), "sin(x)");
        engine.release();
    });
    it("im(exp(a*i*x))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `im(exp(a*i*x))`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useCaretForExponentiation: false,
            useDefinitions: false
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Can this be presented better?
        assert.strictEqual(engine.renderAsInfix(actual), "sin(a*x)");
        engine.release();
    });
    it("im(exp(i))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `im(exp(i))`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useCaretForExponentiation: false,
            useDefinitions: false
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Can this be presented better?
        assert.strictEqual(engine.renderAsInfix(actual), "sin(1)");
        engine.release();
    });
    it("im((a**2)**(1/2))", function () {
        const lines: string[] = [
            `im((a**2)**(1/2))`
        ];
        const engine = create_script_context({
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
});
