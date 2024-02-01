
import { assert } from "chai";
import { is_blade } from "math-expression-atoms";
import { create_engine, ExprEngine } from "../src/api/index";
import { render_svg } from "../src/eigenmath/render_svg";
import { SyntaxKind } from "../src/parser/parser";

describe("rendersvg", function () {
    it("x", function () {
        const lines: string[] = [
            `x`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            const svg = render_svg(value, { useImaginaryI: true, useImaginaryJ: false }, engine);
            assert.strictEqual(svg, `<svg height='36'width='31'><text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='10'y='26'>x</text></svg>`);
        }
        engine.release();
    });
    xit("sin(x)", function () {
        const lines: string[] = [
            `sin(x)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            const svg = render_svg(value, { useImaginaryI: true, useImaginaryJ: false }, engine);
            assert.strictEqual(svg, `<svg height='41'width='75'><text style='font-family:"Times New Roman";font-size:24px;'x='10'y='26'>s</text><text style='font-family:"Times New Roman";font-size:24px;'x='19.33984375'y='26'>i</text><text style='font-family:"Times New Roman";font-size:24px;'x='26.0078125'y='26'>n</text><text style='font-family:"Times New Roman";font-size:24px;'x='38.0078125'y='26'>(</text><text style='font-family:"Times New Roman";font-size:24px;'x='56.65234375'y='26'>)</text><text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='46'y='26'>x</text></svg>`);
        }
        engine.release();
    });
    it("cos(x)", function () {
        const lines: string[] = [
            `cos(x)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            const svg = render_svg(value, { useImaginaryI: true, useImaginaryJ: false }, engine);
            const parts: string[] = [
                `<svg height='41'width='79'>`,
                `<text style='font-family:"Times New Roman";font-size:24px;'x='10'y='26'>c</text>`,
                `<text style='font-family:"Times New Roman";font-size:24px;'x='20.65234375'y='26'>o</text>`,
                `<text style='font-family:"Times New Roman";font-size:24px;'x='32.65234375'y='26'>s</text>`,
                `<text style='font-family:"Times New Roman";font-size:24px;'x='41.9921875'y='26'>(</text>`,
                `<text style='font-family:"Times New Roman";font-size:24px;'x='60.63671875'y='26'>)</text>`,
                `<text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='49.984375'y='26'>x</text>`,
                `</svg>`,
            ];
            assert.strictEqual(svg, parts.join(''));
        }
        engine.release();
    });
    it("tan(x)", function () {
        const lines: string[] = [
            `tan(x)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            const svg = render_svg(value, { useImaginaryI: true, useImaginaryJ: false }, engine);
            const parts: string[] = [
                `<svg height='41'width='76'>`,
                `<text style='font-family:"Times New Roman";font-size:24px;'x='10'y='26'>t</text>`,
                `<text style='font-family:"Times New Roman";font-size:24px;'x='16.66796875'y='26'>a</text>`,
                `<text style='font-family:"Times New Roman";font-size:24px;'x='27.3203125'y='26'>n</text>`,
                `<text style='font-family:"Times New Roman";font-size:24px;'x='39.3203125'y='26'>(</text>`,
                `<text style='font-family:"Times New Roman";font-size:24px;'x='57.96484375'y='26'>)</text>`,
                `<text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='47.3125'y='26'>x</text>`,
                `</svg>`,
            ];
            assert.strictEqual(svg, parts.join(''));
        }
        engine.release();
    });
    it("tau(1/2)", function () {
        const lines: string[] = [
            `tau(1/2)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            const svg = render_svg(value, { useImaginaryI: true, useImaginaryJ: false }, engine);
            const parts: string[] = [
                `<svg height='36'width='32'>`,
                `<text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='10'y='26'>&pi;</text>`,
                `</svg>`,
            ];
            assert.strictEqual(svg, parts.join(''));
        }
        engine.release();
    });
    xit("Uom", function () {
        const lines: string[] = [
            `uom("kilogram")`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            const svg = render_svg(value, { useImaginaryI: true, useImaginaryJ: false }, engine);
            const parts: string[] = [
                `<svg height='41'width='44'>`,
                `<text style='font-family:"Times New Roman";font-size:24px;'x='10'y='26'>k</text>`,
                `<text style='font-family:"Times New Roman";font-size:24px;'x='22'y='26'>g</text>`,
                `</svg>`
            ];
            assert.strictEqual(svg, parts.join(''));
        }
        engine.release();
    });
    it("Blade", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `G30[1]`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (is_blade(value)) {
                const svg = render_svg(value, { useImaginaryI: true, useImaginaryJ: false }, engine);
                const parts: string[] = [
                    `<svg height='36'width='43'>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='10'y='26'>e</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='20.65234375'y='26'>1</text>`,
                    `</svg>`
                ];
                assert.strictEqual(svg, parts.join(''));
            }
        }
        engine.release();
    });
    it("sqrt(-1)", function () {
        const lines: string[] = [
            `sqrt(-1)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            const svg = render_svg(value, { useImaginaryI: true, useImaginaryJ: false }, engine);
            const parts: string[] = [
                `<svg height='36'width='27'>`,
                `<text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='10'y='26'>i</text>`,
                `</svg>`
            ];
            assert.strictEqual(svg, parts.join(''));
        }
        engine.release();
    });
});