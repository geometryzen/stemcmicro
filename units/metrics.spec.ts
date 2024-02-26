import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";

describe("metrics", function () {
    it("Euclidean", function () {
        const lines: string[] = [
            `G11 = algebra([1.0, 1.0], ["i", "j"])`,
            `e1 = G11[1]`,
            `e2 = G11[2]`,
            `abs(e1)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1.0");
        engine.release();
    });
    it("General", function () {
        const lines: string[] = [
            `G11 = algebra([g11, g22], ["i", "j"])`,
            `e1 = G11[1]`,
            `e2 = G11[2]`,
            `abs(e1)`,
            `e1|e1`,
            `e1|e2`,
            `e2|e1`,
            `e2|e2`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "g11**(1/2)");
        assert.strictEqual(engine.renderAsInfix(values[1]), "g11");
        assert.strictEqual(engine.renderAsInfix(values[2]), "0");
        assert.strictEqual(engine.renderAsInfix(values[3]), "0");
        assert.strictEqual(engine.renderAsInfix(values[4]), "g22");
        engine.release();
    });
});
