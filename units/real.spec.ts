import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { create_script_context } from "../index";

xdescribe("real", function () {
    it("When useDefinitions is true, assumeRealVariables should be 1", function () {
        const lines: string[] = [
            `assumeRealVariables`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("When useDefinitions is true, a symbol should be considered real (i.e. not complex).", function () {
        const lines: string[] = [
            `real(z)`
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
    it("When useDefinitions is false, assumeRealVariables should be an unbound symbol", function () {
        const lines: string[] = [
            `assumeRealVariables`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "assumeRealVariables");
        engine.release();
    });
    it("When useDefinitions is false, a symbol should be considered possibly complex", function () {
        const lines: string[] = [
            `real(z)`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "real(z)");
        engine.release();
    });
    it("exp(x*i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `real(exp(x*i))`
        ];
        const engine = create_script_context({
            dependencies: ['Imu']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(cos x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(x)");
        engine.release();
    });
    it("real(x+i*y) => x, when variables are assumed to be real.", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `real(x+i*y)`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "x");
        engine.release();
    });
    it("real(x+i*y) => real(x)+real(i*y), when variables may be complex", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `real(x+i*y)`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "real(x)+real(i*y)");
        engine.release();
    });
    it("real(exp(i*x)) => cos(x)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `real(exp(i*x))`
        ];
        const engine = create_script_context({
            dependencies: ['Imu']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(cos x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(x)");
        engine.release();
    });
    it("", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `real(1/(x+i*y))`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "x/(x^2+y^2)");
        engine.release();
    });
});
