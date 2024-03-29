import assert from 'assert';
import { Directive } from "../src/env/ExtensionEnv";
import { create_script_context } from "../src/runtime/script_engine";

describe("hermite", function () {
    it("hermite(x,0)", function () {
        const lines: string[] = [
            `hermite(x,0)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("hermite(x,1)", function () {
        const lines: string[] = [
            `hermite(x,1)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "2*x");
        engine.release();
    });
    it("hermite(x,2)", function () {
        const lines: string[] = [
            `hermite(x,2)`
        ];
        const engine = create_script_context({
            disable: [Directive.factoring]
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "-2+4*x**2");
        engine.release();
    });
    it("hermite(x,3)", function () {
        const lines: string[] = [
            `hermite(x,3)`
        ];
        const engine = create_script_context({
            disable: [Directive.factoring]
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "-12*x+8*x**3");
        engine.release();
    });
    it("hermite(x,4)", function () {
        const lines: string[] = [
            `hermite(x,4)`
        ];
        const engine = create_script_context({
            disable: [Directive.factoring]
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "12-48*x**2+16*x**4");
        engine.release();
    });
});
