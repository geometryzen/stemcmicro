import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("laguerre", function () {
    it("laguerre(x,0)", function () {
        const lines: string[] = [
            `laguerre(x,0)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("laguerre(x,1)", function () {
        const lines: string[] = [
            `laguerre(x,1)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1-x");
        engine.release();
    });
    it("laguerre(x,2)", function () {
        const lines: string[] = [
            `laguerre(x,2)`
        ];
        const engine = create_script_context({
            disable: ['factor']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1-2*x+1/2*x**2");
        engine.release();
    });
    it("laguerre(x,3)", function () {
        const lines: string[] = [
            `laguerre(x,3)`
        ];
        const engine = create_script_context({
            disable: ['factor']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1-3*x+3/2*x**2-1/6*x**3");
        engine.release();
    });
});
