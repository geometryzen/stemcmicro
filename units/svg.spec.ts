
import { assert } from "chai";
import { is_uom } from "math-expression-atoms";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/api";
import { render_svg, SvgRenderConfig } from "../src/eigenmath/render_svg";
import { SyntaxKind } from "../src/parser/parser";
import { create_script_context, ScriptContext } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("svg", function () {

    const svg_J: string = [
        `<svg height='36'width='29'>`,
        `<text style='font-family:"Times New Roman";font-size:24px;'x='10'y='26'>J</text>`,
        `</svg>`
    ].join('');

    const svg_Omega: string = [
        `<svg height='36'width='38'><text style='font-family:"Times New Roman";font-size:24px;'x='10'y='26'>&Omega;</text></svg>`
    ].join('');

    describe("uom", function () {
        it("joule", function () {
            const lines: string[] = [
                `(uom "joule")`
            ];
            const sourceText = lines.join('\n');
            const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
            const { trees, errors } = engine.parse(sourceText, {});
            assert.strictEqual(errors.length, 0);
            assert.strictEqual(trees.length, 1);

            const values: U[] = [];
            for (const tree of trees) {
                const value = engine.valueOf(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            assert.strictEqual(values.length, 1);
            assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), 'J');
            assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), 'J');
            assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), 'J');
            assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), 'J');
            assert.strictEqual(engine.renderAsString(values[0], { format: 'SVG' }), svg_J);
            assert.strictEqual(is_uom(values[0]), true);
            engine.release();
        });
        it("ohm", function () {
            const lines: string[] = [
                `(uom "ohm")`
            ];
            const sourceText = lines.join('\n');
            const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
            const { trees, errors } = engine.parse(sourceText, {});
            assert.strictEqual(errors.length, 0);
            assert.strictEqual(trees.length, 1);

            const values: U[] = [];
            for (const tree of trees) {
                const value = engine.valueOf(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            assert.strictEqual(values.length, 1);
            assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), 'Ω');
            assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), 'Ω');
            assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), 'Ω');
            assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), 'Ω');
            assert.strictEqual(engine.renderAsString(values[0], { format: 'SVG' }), svg_Omega);
            assert.strictEqual(is_uom(values[0]), true);
            engine.release();
        });
    });
    xit("x", function () {
        const lines: string[] = [
            `x`,
        ];
        const engine: ScriptContext = create_script_context({});
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x");
        const options: SvgRenderConfig = {
            useImaginaryI: true,
            useImaginaryJ: false
        };
        const actual = render_svg(value, options);
        const expect = `<svg height='36'width='31'><text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='10'y='26'>x</text></svg>`;
        assert.strictEqual(actual, expect);
        engine.release();
    });
});