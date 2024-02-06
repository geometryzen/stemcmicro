
import { assert } from "chai";
import { U } from "math-expression-tree";
import { create_engine } from "../src/api/api";

const svg: string = [
    `<svg height='36'width='135'>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='10'y='26'>1</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='22'y='26'>5</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='34'y='26'>9</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='52'y='26'>e</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='62.65234375'y='26'>1</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='80.65234375'y='26'>M</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='107.9921875'y='26'>N</text>`,
    `</svg>`
].join('');

describe("prefixes", function () {
    it("values", function () {
        const lines: string[] = [
            `deci`,
            `centi`,
            `milli`,
            `micro`,
            `nano`,
            `pico`,
            `femto`,
            `atto`,
            `deka`,
            `hecto`,
            `kilo`,
            `mega`,
            `giga`,
            `tera`,
            `peta`,
            `exa`
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 16);
        assert.strictEqual(engine.renderAsString(values[0]), "1/10");                   // deci
        assert.strictEqual(engine.renderAsString(values[1]), "1/100");                  // centi
        assert.strictEqual(engine.renderAsString(values[2]), "1/1000");                 // milli
        assert.strictEqual(engine.renderAsString(values[3]), "1/1000000");              // micro
        assert.strictEqual(engine.renderAsString(values[4]), "1/1000000000");           // nano
        assert.strictEqual(engine.renderAsString(values[5]), "1/1000000000000");        // pico
        assert.strictEqual(engine.renderAsString(values[6]), "1/1000000000000000");     // femto
        assert.strictEqual(engine.renderAsString(values[7]), "1/1000000000000000000");  // atto
        assert.strictEqual(engine.renderAsString(values[8]), "10");                     // deka
        assert.strictEqual(engine.renderAsString(values[9]), "100");                    // hecto
        assert.strictEqual(engine.renderAsString(values[10]), "1000");                  // kilo
        assert.strictEqual(engine.renderAsString(values[11]), "1000000");               // mega
        assert.strictEqual(engine.renderAsString(values[12]), "1000000000");            // giga
        assert.strictEqual(engine.renderAsString(values[13]), "1000000000000");         // tera
        assert.strictEqual(engine.renderAsString(values[14]), "1000000000000000");      // peta
        assert.strictEqual(engine.renderAsString(values[15]), "1000000000000000000");   // exa
        engine.release();
    });
    it("ordering", function () {
        const lines: string[] = [
            `(159 * mega * e1 * newton)/mega * "mega"`
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), `159 e1 "mega" N`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), `159 e1 M N`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `159*e1*"mega"*N`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'LaTeX' }), `159e1"mega"N`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `(* 159 e1 "mega" N)`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SVG' }), svg);
        engine.release();
    });
});