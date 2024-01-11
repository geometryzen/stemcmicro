
import { assert } from "chai";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";

describe("sandbox", function () {
    it("-1.0*e2", function () {
        const lines: string[] = [
            `G20=algebra([1,1],["e1","e2"])
            e1=G20[1]
            e2=G20[2]
            -1.0*e2`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 4);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), "-e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), "-e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "-e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'LaTeX' }), "-e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "(* -1.0 e2)");
        engine.release();
    });
    it("-2.0*e2", function () {
        const lines: string[] = [
            `G20=algebra([1,1],["e1","e2"])
            e1=G20[1]
            e2=G20[2]
            -2.0*e2`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 4);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), "-2.0 e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), "-2.0 e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "-2.0*e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'LaTeX' }), "-2.0e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "(* -2.0 e2)");
        engine.release();
    });
    xit("float(Fg/scaling)", function () {
        const lines: string[] = [
            `G20=algebra([1,1],["e1","e2"])
            e1=G20[1]
            e2=G20[2]
            meter=uom("meter")
            kilogram=uom("kilogram")
            second=uom("second")
            scaling=g * m * kilogram * meter / second /second
            ag = g * (-e2) * meter / second / second
            mass=m*kilogram
            Fg = mass * ag
            es=cos(theta)*e1+sin(theta)*e2
            en=-sin(theta)*e1+cos(theta)*e2
            Fn=K*en
            Fs=S*es
            Fnet=Fn+Fs+Fg
            S=S-simplify(es|Fnet)
            K=K-simplify(en|Fnet)
            Fn=K*en
            Fs=S*es
            Fnet=simplify(Fn+Fs+Fg)
            float(Fg/scaling)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 21);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "-1.0*e2");
        engine.release();
    });
});