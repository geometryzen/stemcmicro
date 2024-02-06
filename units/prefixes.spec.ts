
import { assert } from "chai";
import { U } from "math-expression-tree";
import { create_engine } from "../src/api/api";

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
});