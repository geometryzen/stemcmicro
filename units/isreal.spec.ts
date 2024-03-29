import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("isreal", function () {
    it("isreal(i^(4/1)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `isreal(i**(4/1))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.strictEqual(Array.isArray(errors), true);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "true");
        assert.strictEqual(context.renderAsInfix(values[0]), "true");
        context.release();
    });
    it("isreal(i^(3/2)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `isreal(i**(3/2))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.strictEqual(Array.isArray(errors), true);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "false");
        assert.strictEqual(context.renderAsInfix(values[0]), "false");
        context.release();
    });
    it("isreal(i**(4/3)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `isreal(i**(4/3))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.strictEqual(Array.isArray(errors), true);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "false");
        assert.strictEqual(context.renderAsInfix(values[0]), "false");
        context.release();
    });
    it("isreal(x^(3/2)", function () {
        const lines: string[] = [
            `isreal(x**(3/2))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.strictEqual(Array.isArray(errors), true);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "false");
        assert.strictEqual(context.renderAsInfix(values[0]), "false");
        context.release();
    });
    it("re(re(z))", function () {
        const lines: string[] = [
            `re(re(z))`
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
    it("imag(z)", function () {
        const lines: string[] = [
            `imag(z)`
        ];
        const engine = create_script_context({
            assumes: {
                'z': { real: false }
            },
            dependencies: ['Imu'],
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "imag(z)");
        engine.release();
    });
    it("re(imag(z))", function () {
        const lines: string[] = [
            `re(imag(z))`
        ];
        const engine = create_script_context({
            assumes: {
                'z': { real: false }
            },
            dependencies: ['Imu'],
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "imag(z)");
        engine.release();
    });
    it("re(-imag(z))", function () {
        const lines: string[] = [
            `re(-imag(z))`
        ];
        const engine = create_script_context({
            assumes: {
                'z': { real: false }
            },
            dependencies: ['Imu'],
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "-imag(z)");
        engine.release();
    });
    it("re(i*z) when z is not real", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
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
        assert.strictEqual(engine.renderAsInfix(values[0]), "-imag(z)");
        engine.release();
    });
    it("imag(a+i*b)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `imag(a+i*b)`
        ];
        const engine = create_script_context({
            dependencies: ['Imu']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "b");
        assert.strictEqual(engine.renderAsInfix(values[0]), "b");
        engine.release();
    });
    it("isreal(a), when a is real.", function () {
        const lines: string[] = [
            `isreal(a)`
        ];
        const engine = create_script_context({
            assumes: {
                'a': { real: true }
            }
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "true");
        assert.strictEqual(engine.renderAsInfix(values[0]), "true");
        engine.release();
    });
    it("isreal(a) when a is not real.", function () {
        const lines: string[] = [
            `isreal(a)`
        ];
        const engine = create_script_context({
            assumes: {
                'a': { real: false }
            }
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "false");
        assert.strictEqual(engine.renderAsInfix(values[0]), "false");
        engine.release();
    });
    it("isreal(i).", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `isreal(i)`
        ];
        const engine = create_script_context({
            assumes: {
                'a': { real: false }
            }
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "false");
        assert.strictEqual(engine.renderAsInfix(values[0]), "false");
        engine.release();
    });
    it("isreal(i*y).", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `isreal(i*y)`
        ];
        const engine = create_script_context({
            assumes: {
                'y': { real: true }
            }
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "false");
        assert.strictEqual(engine.renderAsInfix(values[0]), "false");
        engine.release();
    });
    it("imag(a+i*b)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `imag(a+i*b)`
        ];
        const engine = create_script_context({
            assumes: {
                'a': { real: true },
                'b': { real: true }
            },
            dependencies: ['Imu']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "b");
        assert.strictEqual(engine.renderAsInfix(values[0]), "b");
        engine.release();
    });
    it("isreal(x**(3/2))", function () {
        const lines: string[] = [
            `isreal(x**(3/2))`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "false");
        engine.release();
    });
    it("isreal(exp(a))", function () {
        const lines: string[] = [
            `autofactor=0`,
            `i=sqrt(-1)`,
            `pi=tau(1)/2`,
            `isreal(exp(a))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({ useCaretForExponentiation: true });

        const { values, errors } = context.executeScript(sourceText, {});
        assert.strictEqual(Array.isArray(errors), true);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "true");
        context.release();
    });
    it("isreal(3^(1/2))", function () {
        const lines: string[] = [
            `autofactor=0`,
            `i=sqrt(-1)`,
            `pi=tau(1)/2`,
            `isreal(3^(1/2))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({ useCaretForExponentiation: true });

        const { values, errors } = context.executeScript(sourceText, {});
        assert.strictEqual(Array.isArray(errors), true);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(Array.isArray(values), true);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "true");
        context.release();
    });
});
