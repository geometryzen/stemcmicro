
import { assert } from "chai";
import { U } from "math-expression-tree";
import { create_engine } from "../src/api/api";

describe("sandbox", function () {
    it("simplify", function () {
        const lines: string[] = [
            `a*d**2/(a*d-b*c)-b*c*d/(a*d-b*c)`
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
        assert.strictEqual(engine.renderAsString(values[0]), "a*d**2/(a*d-b*c)-b*c*d/(a*d-b*c)");
        engine.release();
    });
    it("simplify", function () {
        const lines: string[] = [
            `simplify(a*d**2/(a*d-b*c)-b*c*d/(a*d-b*c))`
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
        assert.strictEqual(engine.renderAsString(values[0]), "d");
        engine.release();
    });
});