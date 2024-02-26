import assert from 'assert';
import { Directive } from "../src/env/ExtensionEnv";
import { stemc_prolog } from "../src/runtime/init";
import { create_script_context } from "../src/runtime/script_engine";

describe("euler", function () {
    it("exp(0)", function () {
        const lines: string[] = [
            `exp(0)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("exp(1)", function () {
        const lines: string[] = [
            `exp(1)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "e");
        engine.release();
    });
    it("exp(-1)", function () {
        const lines: string[] = [
            `exp(-1)`
        ];
        const engine = create_script_context({
            prolog: stemc_prolog
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "exp(-1)");
        engine.release();
    });
    it("exp(i)", function () {
        const lines: string[] = [
            `exp(i)`
        ];
        const engine = create_script_context({
            enable: [Directive.convertExpToTrig],
            prolog: stemc_prolog
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(1)+i*sin(1)");
        engine.release();
    });
    it("exp(-i)", function () {
        const lines: string[] = [
            `exp(-i)`
        ];
        const engine = create_script_context({
            enable: [Directive.convertExpToTrig],
            prolog: stemc_prolog
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(1)-i*sin(1)");
        engine.release();
    });
    it("exp(i*x)", function () {
        const lines: string[] = [
            `exp(i*x)`
        ];
        const engine = create_script_context({
            enable: [Directive.convertExpToTrig],
            prolog: stemc_prolog
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(x)+i*sin(x)");
        engine.release();
    });
    it("exp(-i*x)", function () {
        const lines: string[] = [
            `exp(-i*x)`
        ];
        const engine = create_script_context({
            enable: [Directive.convertExpToTrig],
            prolog: stemc_prolog
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(x)-i*sin(x)");
        engine.release();
    });
});
