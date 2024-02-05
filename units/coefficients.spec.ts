
import { assert } from "chai";
import { is_tensor } from "math-expression-atoms";
import { U } from "math-expression-tree";
import { create_engine } from "../src/api/api";

describe("coefficients", function () {
    it("coefficients(x,x)", function () {
        const lines: string[] = [
            `coefficients(x,x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        // assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), '[0,1]');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("coefficients(a0,x)", function () {
        const lines: string[] = [
            `coefficients(a0,x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        // assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), '[a0]');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("coefficients(a0+a1*x,x)", function () {
        const lines: string[] = [
            `coefficients(a0+a1*x,x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        // assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), '[a0,a1]');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("coefficients(a0+a1*x+a2*x**2,x)", function () {
        const lines: string[] = [
            `coefficients(a0+a1*x+a2*x**2,x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        // assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), '[a0,a1,a2]');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("coefficients(a0+a1*x+a2*x**2+a3*x**3,x)", function () {
        const lines: string[] = [
            `coefficients(a0+a1*x+a2*x**2+a3*x**3,x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        // assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), '[a0,a1,a2,a3]');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("coefficients(a0+a1*x+a2*x**2+a3*x**3+a4*x**4,x)", function () {
        const lines: string[] = [
            `coefficients(a0+a1*x+a2*x**2+a3*x**3+a4*x**4,x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        // assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), '[a0,a1,a2,a3,a4]');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("coefficients(a9*x**9,x)", function () {
        const lines: string[] = [
            `coefficients(a9*x**9,x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        // assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), '[0,0,0,0,0,0,0,0,0,a9]');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("coefficients(a10*x**10,x)", function () {
        const lines: string[] = [
            `coefficients(a10*x**10,x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        // assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), '[0,0,0,0,0,0,0,0,0,0,a10]');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("coefficients(a10*x**10,x)", function () {
        const lines: string[] = [
            `coefficients(a10*x**10,x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        // assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), '[0,0,0,0,0,0,0,0,0,0,a10]');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("coefficients(k*x**11,x)", function () {
        const lines: string[] = [
            `coefficients(k*x**11,x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        // assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), '[0,0,0,0,0,0,0,0,0,0,0,k]');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
});