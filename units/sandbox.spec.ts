
import { assert } from "chai";
import { is_nil } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";

describe("sandbox", function () {
    xit("R", function () {
        const lines: string[] = [
            `kg=uom("kilogram")`,
            `G20=algebra([1,1],["e1","e2"])`,
            `e1=G20[1]`,
            `simplify(-g*M*cos(x)*e1*kg+S*cos(x)**2+S*sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "S-9.81*M*cos(x)*kg");
            }
        }
        engine.release();
    });
});