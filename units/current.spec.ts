import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("current", function () {
    it("abs(x)", function () {
        const lines: string[] = [
            `abs(x)`
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true,
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(abs x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "abs(x)");
        engine.release();
    });
    it("abs(x*y)", function () {
        const lines: string[] = [
            `abs(x*y)`
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
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
        const engine = create_engine({
            dependencies: ['Imu'],
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
        const engine = create_engine({
            dependencies: ['Imu'],
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
            `implicate=1`,
            `abs(a+b+c*i)`,
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "(a**2+2*a*b+b**2+c**2)**(1/2)");
        engine.release();
    });
});
