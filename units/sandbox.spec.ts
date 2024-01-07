
import { assert } from "chai";
import { is_nil } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";

describe("sandbox", function () {
    it("simplifying expressions containing Uom", function () {
        const lines: string[] = [
            `G30 = algebra([1,1,1],["e1","e2","e3"])`,
            `e1  = G30[1]`,
            `e2  = G30[2]`,
            `e3  = G30[3]`,
            ``,
            `kilogram=uom("kilogram")`,
            `meter=uom("meter")
            second=uom("second")
            
            g = 9.81 * (-e2) * meter / second / second
            
            m = 10 * kilogram
            
            F = m * g
            
            # unit vector up the slope
            es = cos(theta) * e1 + sin(theta) * e2
            # unit vector perpendicular and out of the slope
            en = -sin(theta) * e1 + cos(theta) * e2
            
            # If the block is not accelerating then the net force must be zero
            NetF = R * en + S * es + F
            # Component in the plane of the slope must be zero
            simplify(NetF|es)
            # Component perpendicular must be zero
            # NetF|en`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "S-98.100000...*sin(theta)*N");
            }
        }
        engine.release();
    });
});