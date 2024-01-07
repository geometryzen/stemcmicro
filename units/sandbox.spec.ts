
import { assert } from "chai";
import { is_nil } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";

describe("sandbox", function () {
    it("Handling middot", function () {
        const lines: string[] = [
            `k=uom("kilogram")`,
            `m=uom("meter")`,
            `s=uom("second")`,
            `k * m / s`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "kg·m/s");
                assert.strictEqual(engine.renderAsString(value, { format: 'LaTeX' }), "kg·m/s");
                const lines: string[] = [
                    `<svg height='41'width='89'>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='10'y='26'>k</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='22'y='26'>g</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='34'y='26'>&middot;</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='44.65234375'y='26'>m</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='63.3203125'y='26'>/</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='69.98828125'y='26'>s</text>`,
                    `</svg><br>`
                ];
                assert.strictEqual(engine.renderAsString(value, { format: 'SVG' }), lines.join(''));
            }
        }
        engine.release();
    });
});