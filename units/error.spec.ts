
import assert from 'assert';
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/api";

const svg = [
    `<svg height='41'width='633'>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='10' y='26'>&quot;</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='19.796875' y='26'>O</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='37.12890625' y='26'>p</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='49.12890625' y='26'>e</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='59.78125' y='26'>r</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='67.7734375' y='26'>a</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='78.42578125' y='26'>t</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='85.09375' y='26'>o</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='97.09375' y='26'>r</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='105.0859375' y='26'> </text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='111.0859375' y='26'>'</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='115.41015625' y='26'>*</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='127.41015625' y='26'>'</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='131.734375' y='26'> </text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='137.734375' y='26'>c</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='148.38671875' y='26'>a</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='159.0390625' y='26'>n</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='171.0390625' y='26'>n</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='183.0390625' y='26'>o</text><text style='font-family:"Times New Roman";font-size:24px;' x='195.0390625' y='26'>t</text><text style='font-family:"Times New Roman";font-size:24px;' x='201.70703125' y='26'> </text><text style='font-family:"Times New Roman";font-size:24px;' x='207.70703125' y='26'>b</text><text style='font-family:"Times New Roman";font-size:24px;' x='219.70703125' y='26'>e</text><text style='font-family:"Times New Roman";font-size:24px;' x='230.359375' y='26'> </text><text style='font-family:"Times New Roman";font-size:24px;' x='236.359375' y='26'>a</text><text style='font-family:"Times New Roman";font-size:24px;' x='247.01171875' y='26'>p</text><text style='font-family:"Times New Roman";font-size:24px;' x='259.01171875' y='26'>p</text><text style='font-family:"Times New Roman";font-size:24px;' x='271.01171875' y='26'>l</text><text style='font-family:"Times New Roman";font-size:24px;' x='277.6796875' y='26'>i</text><text style='font-family:"Times New Roman";font-size:24px;' x='284.34765625' y='26'>e</text><text style='font-family:"Times New Roman";font-size:24px;' x='295' y='26'>d</text><text style='font-family:"Times New Roman";font-size:24px;' x='307' y='26'> </text><text style='font-family:"Times New Roman";font-size:24px;' x='313' y='26'>t</text><text style='font-family:"Times New Roman";font-size:24px;' x='319.66796875' y='26'>o</text><text style='font-family:"Times New Roman";font-size:24px;' x='331.66796875' y='26'> </text><text style='font-family:"Times New Roman";font-size:24px;' x='337.66796875' y='26'>t</text><text style='font-family:"Times New Roman";font-size:24px;' x='344.3359375' y='26'>y</text><text style='font-family:"Times New Roman";font-size:24px;' x='356.3359375' y='26'>p</text><text style='font-family:"Times New Roman";font-size:24px;' x='368.3359375' y='26'>e</text><text style='font-family:"Times New Roman";font-size:24px;' x='378.98828125' y='26'>s</text><text style='font-family:"Times New Roman";font-size:24px;' x='388.328125' y='26'> </text><text style='font-family:"Times New Roman";font-size:24px;' x='394.328125' y='26'>'</text><text style='font-family:"Times New Roman";font-size:24px;' x='398.65234375' y='26'>b</text><text style='font-family:"Times New Roman";font-size:24px;' x='410.65234375' y='26'>o</text><text style='font-family:"Times New Roman";font-size:24px;' x='422.65234375' y='26'>o</text><text style='font-family:"Times New Roman";font-size:24px;' x='434.65234375' y='26'>l</text><text style='font-family:"Times New Roman";font-size:24px;' x='441.3203125' y='26'>e</text><text style='font-family:"Times New Roman";font-size:24px;' x='451.97265625' y='26'>a</text><text style='font-family:"Times New Roman";font-size:24px;' x='462.625' y='26'>n</text><text style='font-family:"Times New Roman";font-size:24px;' x='474.625' y='26'>'</text><text style='font-family:"Times New Roman";font-size:24px;' x='478.94921875' y='26'> </text><text style='font-family:"Times New Roman";font-size:24px;' x='484.94921875' y='26'>a</text><text style='font-family:"Times New Roman";font-size:24px;' x='495.6015625' y='26'>n</text><text style='font-family:"Times New Roman";font-size:24px;' x='507.6015625' y='26'>d</text><text style='font-family:"Times New Roman";font-size:24px;' x='519.6015625' y='26'> </text><text style='font-family:"Times New Roman";font-size:24px;' x='525.6015625' y='26'>'</text><text style='font-family:"Times New Roman";font-size:24px;' x='529.92578125' y='26'>r</text><text style='font-family:"Times New Roman";font-size:24px;' x='537.91796875' y='26'>a</text><text style='font-family:"Times New Roman";font-size:24px;' x='548.5703125' y='26'>t</text><text style='font-family:"Times New Roman";font-size:24px;' x='555.23828125' y='26'>i</text><text style='font-family:"Times New Roman";font-size:24px;' x='561.90625' y='26'>o</text><text style='font-family:"Times New Roman";font-size:24px;' x='573.90625' y='26'>n</text><text style='font-family:"Times New Roman";font-size:24px;' x='585.90625' y='26'>a</text><text style='font-family:"Times New Roman";font-size:24px;' x='596.55859375' y='26'>l</text><text style='font-family:"Times New Roman";font-size:24px;' x='603.2265625' y='26'>'</text><text style='font-family:"Times New Roman";font-size:24px;' x='607.55078125' y='26'>.</text><text style='font-family:"Times New Roman";font-size:24px;' x='613.55078125' y='26'>&quot;</text></svg>`
].join('');

describe("error", function () {
    it("kronecker", function () {
        const lines: string[] = [
            `true * 5`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({});
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), `"Operator '*' cannot be applied to types 'boolean' and 'rational'."`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), `"Operator '*' cannot be applied to types 'boolean' and 'rational'."`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `"Operator '*' cannot be applied to types 'boolean' and 'rational'."`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'LaTeX' }), `"Operator '*' cannot be applied to types 'boolean' and 'rational'."`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `"Operator '*' cannot be applied to types 'boolean' and 'rational'."`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SVG' }), svg);
        engine.release();
    });
});