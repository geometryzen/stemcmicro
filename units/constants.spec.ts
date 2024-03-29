
import assert from 'assert';
import { is_sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/api";
import { assert_sym } from "../src/operators/sym/assert_sym";
import { SyntaxKind } from "../src/parser/parser";

const pi_svg_sym = [
    `<svg height='36'width='32'>`,
    `<text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='10'y='26'>&pi;</text>`,
    `</svg>`
].join('');

const pi_svg_digits = [
    `<svg height='36'width='98'>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='10'y='26'>3</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='22'y='26'>.</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='28'y='26'>1</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='40'y='26'>4</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='52'y='26'>1</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='64'y='26'>5</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='76'y='26'>9</text>`,
    `</svg>`
].join('');

describe("pi in Eigenmath", function () {
    it("is recognized as being the mathematical symbol", function () {
        const lines: string[] = [
            `pi=tau(1/2)`,
            `pi`,
            `float(pi)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 2);

        assert.strictEqual(is_sym(values[0]), true, `${values[0]}`);
        const actualPi = assert_sym(values[0]);
        const PI = native_sym(Native.PI);
        assert.strictEqual(actualPi.equals(PI), true);

        assert.strictEqual(engine.renderAsString(PI, { format: 'Ascii' }), `pi`);
        assert.strictEqual(engine.renderAsString(PI, { format: 'Human' }), `pi`);
        assert.strictEqual(engine.renderAsString(PI, { format: 'Infix' }), `pi`);
        assert.strictEqual(engine.renderAsString(PI, { format: 'LaTeX' }), `\\pi`);
        assert.strictEqual(engine.renderAsString(PI, { format: 'SExpr' }), `pi`);
        // assert.strictEqual(engine.renderAsString(PI, { format: 'SVG' }), pi_svg_sym);

        assert.strictEqual(engine.renderAsString(values[1], { format: 'Ascii' }), `3.141593...`);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Human' }), `3.141593...`);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), `3.141593...`);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'LaTeX' }), `3.141593...`);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'SExpr' }), `3.141593...`);
        // assert.strictEqual(engine.renderAsString(values[1], { format: 'SVG' }), pi_svg_digits);

        engine.release();
    });
});
describe("pi in Eigenmath", function () {
    it("is recognized as being the mathematical symbol", function () {
        const lines: string[] = [
            `pi=tau(1/2)`,
            `pi`,
            `float(pi)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({
            syntaxKind: SyntaxKind.Eigenmath
        });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 2);

        assert.strictEqual(is_sym(values[0]), true, `${values[0]}`);
        const actualPi = assert_sym(values[0]);
        const PI = native_sym(Native.PI);
        assert.strictEqual(actualPi.equals(PI), true);

        assert.strictEqual(engine.renderAsString(PI, { format: 'Ascii' }), `pi`);
        assert.strictEqual(engine.renderAsString(PI, { format: 'Human' }), `pi`);
        assert.strictEqual(engine.renderAsString(PI, { format: 'Infix' }), `pi`);
        // TODO: Eigenmath can't do LaTeX
        // assert.strictEqual(engine.renderAsString(PI, { format: 'LaTeX' }), `\\pi`);
        assert.strictEqual(engine.renderAsString(PI, { format: 'SExpr' }), `pi`);
        // assert.strictEqual(engine.renderAsString(PI, { format: 'SVG' }), pi_svg_sym);

        assert.strictEqual(engine.renderAsString(values[1], { format: 'Ascii' }), `3.14159`);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Human' }), `3.14159`);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), `3.14159`);
        // TODO: Eigenmath can't do LaTeX
        // assert.strictEqual(engine.renderAsString(values[1], { format: 'LaTeX' }), `3.14159`);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'SExpr' }), `3.14159`);
        // assert.strictEqual(engine.renderAsString(values[1], { format: 'SVG' }), pi_svg_digits);

        engine.release();
    });
});
describe("pi in ClojureScript", function () {
    xit("is recognized as being the mathematical symbol", function () {
        const lines: string[] = [
            `pi=tau(1/2)`,
            `pi`,
            `float(pi)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({
            syntaxKind: SyntaxKind.ClojureScript
        });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 2);

        assert.strictEqual(is_sym(values[0]), true, `${values[0]}`);
        const actualPi = assert_sym(values[0]);
        const PI = native_sym(Native.PI);
        assert.strictEqual(actualPi.equals(PI), true);

        assert.strictEqual(engine.renderAsString(PI, { format: 'Ascii' }), `pi`);
        assert.strictEqual(engine.renderAsString(PI, { format: 'Human' }), `pi`);
        assert.strictEqual(engine.renderAsString(PI, { format: 'Infix' }), `pi`);
        assert.strictEqual(engine.renderAsString(PI, { format: 'LaTeX' }), `\\pi`);
        assert.strictEqual(engine.renderAsString(PI, { format: 'SExpr' }), `pi`);
        assert.strictEqual(engine.renderAsString(PI, { format: 'SVG' }), pi_svg_sym);

        assert.strictEqual(engine.renderAsString(values[1], { format: 'Ascii' }), `3.141593...`);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Human' }), `3.141593...`);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), `3.141593...`);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'LaTeX' }), `3.141593...`);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'SExpr' }), `3.141593...`);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'SVG' }), pi_svg_digits);

        engine.release();
    });
});
