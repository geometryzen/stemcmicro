import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("nroots((1+i)*x^2+1)", function () {
        const lines: string[] = [
            `nroots((1+i)*x^2+1)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[-0.171780...-0.727673...*i,0.171780...+0.727673...*i]");
        engine.release();
    });
    xit("imag(a+i*b)", function () {
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
    xit("isreal(a), when a is real.", function () {
        const lines: string[] = [
            `isreal(a)`
        ];
        const engine = create_script_context({
            assumes: {
                'a': { real: true }
            }
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "#t");
        assert.strictEqual(engine.renderAsInfix(values[0]), "true");
        engine.release();
    });
    xit("isreal(a) when a is not real.", function () {
        const lines: string[] = [
            `isreal(a)`
        ];
        const engine = create_script_context({
            assumes: {
                'a': { real: false }
            }
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "#f");
        assert.strictEqual(engine.renderAsInfix(values[0]), "false");
        engine.release();
    });
    xit("isreal(i).", function () {
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
        assert.strictEqual(engine.renderAsSExpr(values[0]), "#f");
        assert.strictEqual(engine.renderAsInfix(values[0]), "false");
        engine.release();
    });
    xit("isreal(i*y).", function () {
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
        assert.strictEqual(engine.renderAsSExpr(values[0]), "#f");
        assert.strictEqual(engine.renderAsInfix(values[0]), "false");
        engine.release();
    });
    xit("imag(a+i*b)", function () {
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
});
