import { assert } from "chai";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/api";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("float", function () {
    it("A", function () {
        const lines: string[] = [
            `float(tau(1/2))`
        ];
        const engine = create_script_context({
            dependencies: ['Flt']
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "3.141593...");
        assert.strictEqual(engine.renderAsInfix(actual), "3.141593...");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [
            `1+i`
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ 1 i)");
        assert.strictEqual(engine.renderAsInfix(actual), "1+i");
        engine.release();
    });
    it("C", function () {
        const lines: string[] = [
            `1+2*i`
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ 1 (* 2 i))");
        assert.strictEqual(engine.renderAsInfix(actual), "1+2*i");
        engine.release();
    });
    it("D", function () {
        const lines: string[] = [
            `(1+2*i)^(1/2)`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(pow (+ 1 (* 2 i)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(actual), "(1+2*i)^(1/2)");
        engine.release();
    });
    xit("E", function () {
        const lines: string[] = [
            `float((1+2*i)^(1/2))`
        ];
        const engine = create_script_context({
            dependencies: ['Flt'],
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(engine.renderAsSExpr(actual), "(pow (add 1.0 (multiply 2.0 i)) 0.5)");
        assert.strictEqual(engine.renderAsInfix(actual), "1.272020...+0.786151...*i");
        engine.release();
    });
    it("F", function () {
        const lines: string[] = [
            `float(x)`
        ];
        const engine = create_script_context({
            dependencies: ['Flt']
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "x");
        assert.strictEqual(engine.renderAsInfix(actual), "x");
        engine.release();
    });
    it("G", function () {
        const lines: string[] = [
            `pi=tau(1/2)`,
            `float(pi)`
        ];
        const engine = create_script_context({
            dependencies: ['Flt']
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "3.141593...");
        assert.strictEqual(engine.renderAsInfix(actual), "3.141593...");
        engine.release();
    });
    it("float(exp(1))", function () {
        const lines: string[] = [
            `float(exp(1))`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context({});
        const { values, errors } = engine.executeScript(sourceText);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const error of errors) {
            // eslint-disable-next-line no-console
            // console.lg("error", error);
        }
        for (const value of values) {
            assert.strictEqual(engine.renderAsInfix(value), "2.718282...");
        }
        engine.release();
    });
    it("log(-1.0)", function () {
        const lines: string[] = [
            `log(-1.0)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context({});
        const { values, errors } = engine.executeScript(sourceText);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const error of errors) {
            // eslint-disable-next-line no-console
            // console.lg("error", error);
        }
        for (const value of values) {
            assert.strictEqual(engine.renderAsInfix(value), "3.141593...*i");
        }
        engine.release();
    });
    it("log(-1.0)", function () {
        const lines: string[] = [
            `log(-1.0)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context({});
        const { values, errors } = engine.executeScript(sourceText);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const error of errors) {
            // eslint-disable-next-line no-console
            // console.lg("error", error);
        }
        for (const value of values) {
            assert.strictEqual(engine.renderAsInfix(value), "3.141593...*i");
        }
        engine.release();
    });
    it("float(-1)", function () {
        const lines: string[] = [
            `G20=algebra([1,1],["e1","e2"])
            e1=G20[1]
            e2=G20[2]
            float(-1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 4);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), "-1.0");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), "-1.0");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "-1.0");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'LaTeX' }), "-1.0");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "-1.0");
        // The following looks wrong because it should be a float.
        const svg = [
            `<svg height='36'width='49'>`,
            `<text style='font-family:"Times New Roman";font-size:24px;' x='10' y='26'>&minus;</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;' x='26.53515625' y='26'>1</text>`,
            `</svg>`
        ].join('');
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SVG' }), svg);
        engine.release();
    });
    it("float(e2)", function () {
        const lines: string[] = [
            `G20=algebra([1,1],["e1","e2"])
            e1=G20[1]
            e2=G20[2]
            float(e2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 4);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "e2");
        engine.release();
    });
    it("float(-e2)", function () {
        const lines: string[] = [
            `G20=algebra([1,1],["e1","e2"])
            e1=G20[1]
            e2=G20[2]
            float(-e2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 4);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "(* -1.0 e2)");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), "-e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "-e2");
        engine.release();
    });
    it("float(-1.0*e2)", function () {
        const lines: string[] = [
            `G20=algebra([1,1],["e1","e2"])
            e1=G20[1]
            e2=G20[2]
            float(-1.0*e2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 4);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
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
    it("float(-1.1*e2)", function () {
        const lines: string[] = [
            `G20=algebra([1,1],["e1","e2"])
            e1=G20[1]
            e2=G20[2]
            -1.1*e2`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 4);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), "-1.1*e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), "-1.1 e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "-1.1*e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'LaTeX' }), "-1.1e2");
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "(* -1.0 e2)");
        engine.release();
    });
    it("float(Fg/scaling)", function () {
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
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 21);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "(* -1.0 e2)");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "-e2");
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
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 21);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "-1.0*e2");
        engine.release();
    });
});
