
import { assert } from "chai";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";

describe("sandbox", function () {
    it("Free Body Diagram", function () {
        const lines: string[] = [
            `1/(1/x)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "x");
        engine.release();
    });
    it("Free Body Diagram", function () {
        const lines: string[] = [
            `G20=algebra([1],["e"])`,
            `e=G20[1]`,
            `1/e`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "e");
        engine.release();
    });
    it("Free Body Diagram", function () {
        const lines: string[] = [
            `G20=algebra([1],["e"])`,
            `e=G20[1]`,
            `1/(1/e)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "e");
        engine.release();
    });
    it("Free Body Diagram", function () {
        const lines: string[] = [
            `G20=algebra([1,1],["e1","e2"])`,
            `e1=G20[1]`,
            `e2=G20[2]`,
            `ag = g * (-e2)`,
            `Fg = m * ag`,
            `es=cos(theta)*e1+sin(theta)*e2`,
            `en=-sin(theta)*e1+cos(theta)*e2`,
            `Fn=K*en`,
            `Fs=S*es`,
            `Fnet=Fn+Fs+Fg`,
            `S=S-simplify(es|Fnet)`,
            `K=K-simplify(en|Fnet)`,
            `Fn=K*en`,
            `Fs=S*es`,
            `Fn`,
            `Fs`,
            `Fg`,
            `Fnet=simplify(Fn+Fs+Fg)`,  // Error on this line.
            //            `scaling=g*m`,
            //            `float(Fg/scaling)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 3);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "-g*m*cos(theta)*sin(theta)*e1+g*m*cos(theta)**2*e2");
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), "g*m*cos(theta)*sin(theta)*e1+g*m*sin(theta)**2*e2");
        assert.strictEqual(engine.renderAsString(values[2], { format: 'Infix' }), "-g*m*e2");
        engine.release();
    });
});