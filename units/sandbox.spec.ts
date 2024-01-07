
import { assert } from "chai";
import { is_nil } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";

describe("sandbox", function () {
    it("GA and uom", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `m=uom("meter")`,
            `s=uom("second")`,
            `g=9.81*(-e2) * m/s/s`,
            `g`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value), "-9.81*e2*m/s ** 2");
            }
        }
        engine.release();
    });
});