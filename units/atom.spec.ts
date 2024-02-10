
import { assert } from "chai";
import { create_sym, JsAtom } from "math-expression-atoms";
import { ExprContext, LambdaExpr } from "math-expression-context";
import { Cons, is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/api";
import { SyntaxKind } from "../src/parser/parser";

class TestAtom extends JsAtom {
    readonly type = 'testatom';
    constructor() {
        super('TestAtom');
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const create_atom: LambdaExpr = (argList: Cons, _$: ExprContext): U => {
    return new TestAtom();
};


describe("atom", function () {
    it("Native handling of custom atom", function () {
        const lines: string[] = [
            `A=atom()`,
            `abs(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine();
        engine.defineFunction(create_sym("atom"), create_atom);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "abs(TestAtom)");
            }
        }
        engine.release();
    });
    it("Eigenmath handling of custom atom", function () {
        const lines: string[] = [
            `A=atom()`,
            `abs(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Eigenmath });
        engine.defineFunction(create_sym("atom"), create_atom);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "abs(TestAtom)");
                const lines: string[] = [
                    `<svg height='41'width='213'>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='10'y='26'>a</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='20.65234375'y='26'>b</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='32.65234375'y='26'>s</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='41.9921875'y='26'>(</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='194.58203125'y='26'>)</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='49.984375'y='26'>[</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='57.9765625'y='26'>o</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='69.9765625'y='26'>b</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='81.9765625'y='26'>j</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='88.64453125'y='26'>e</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='99.296875'y='26'>c</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='109.94921875'y='26'>t</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='116.6171875'y='26'> </text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='122.6171875'y='26'>O</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='139.94921875'y='26'>b</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='151.94921875'y='26'>j</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='158.6171875'y='26'>e</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='169.26953125'y='26'>c</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='179.921875'y='26'>t</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='186.58984375'y='26'>]</text>`,
                    `</svg>`
                ];
                lines.join('');
                // The default implementation of Atom.toString() may change.
                // assert.strictEqual(engine.renderAsString(value, { format: 'SVG' }), lines.join(''));
            }
        }
        engine.release();
    });
});