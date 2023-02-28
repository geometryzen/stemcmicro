import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("round", function () {
    it("round(5/2)", function () {
        const lines: string[] = [
            `round(5/2)`,
        ];
        const engine = create_script_engine({
            dependencies: ['Flt'],
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "3");
        engine.release();
    });
    it("round(5/2.0)", function () {
        const lines: string[] = [
            `round(5/2.0)`,
        ];
        const engine = create_script_engine({
            dependencies: ['Flt'],
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "3.0");
        engine.release();
    });
    it("round(5/2) - round(5/2.0)", function () {
        const lines: string[] = [
            `round(5/2) - round(5/2.0)`,
        ];
        const engine = create_script_engine({
            dependencies: ['Flt'],
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0.0");
        engine.release();
    });
});
