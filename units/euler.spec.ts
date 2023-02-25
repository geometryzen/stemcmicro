import { assert } from "chai";
import { createScriptEngine } from "../index";

describe("euler", function () {
    it("exp(0)", function () {
        const lines: string[] = [
            `exp(0)`
        ];
        const engine = createScriptEngine({
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("exp(1)", function () {
        const lines: string[] = [
            `exp(1)`
        ];
        const engine = createScriptEngine({
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "e");
        engine.release();
    });
    it("exp(-1)", function () {
        const lines: string[] = [
            `exp(-1)`
        ];
        const engine = createScriptEngine({
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "exp(-1)");
        engine.release();
    });
    it("exp(i)", function () {
        const lines: string[] = [
            `exp(i)`
        ];
        const engine = createScriptEngine({
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(1)+i*sin(1)");
        engine.release();
    });
    it("exp(-i)", function () {
        const lines: string[] = [
            `exp(-i)`
        ];
        const engine = createScriptEngine({
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(1)-i*sin(1)");
        engine.release();
    });
    it("exp(i*x)", function () {
        const lines: string[] = [
            `exp(i*x)`
        ];
        const engine = createScriptEngine({
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(x)+i*sin(x)");
        engine.release();
    });
    it("exp(-i*x)", function () {
        const lines: string[] = [
            `exp(-i*x)`
        ];
        const engine = createScriptEngine({
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(x)-i*sin(x)");
        engine.release();
    });
});
