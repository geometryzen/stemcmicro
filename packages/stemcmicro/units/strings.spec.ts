import assert from "assert";
import { assert_str, is_str, Str } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";
import { create_engine } from "../src/api/api";

const core_with_nl = "a\nb";
const core_with_cr = "c\rd";
const cnlstr = new Str(core_with_nl);
const ccrstr = new Str(core_with_cr);
const core_nl_with_delims = JSON.stringify(core_with_nl);
const core_cr_with_delims = JSON.stringify(core_with_cr);

describe("sandbox", function () {
    it("newline", function () {
        const engine = create_engine();
        const { trees, errors } = engine.parse(core_nl_with_delims);

        assert.strictEqual(errors.length, 0);

        assert.strictEqual(trees.length, 1);
        const tree = trees[0];
        const pstr = assert_str(tree);
        assert.strictEqual(JSON.stringify(pstr.str).length, 6);
        //
        assert.strictEqual(core_with_nl.length, 3);
        assert.strictEqual(cnlstr.str.length, 3);
        // This should be 3.
        assert.strictEqual(pstr.str.length, 3);
        assert.strictEqual(core_nl_with_delims.length, 6); // end delimiters plus escaping of the newline
        assert.strictEqual(cnlstr.str, core_with_nl);
        // The parsed string does not have the un-escaped newline
        assert.strictEqual(pstr.str, core_with_nl);
        assert.strictEqual(pstr.str.toString(), core_with_nl);
        assert.strictEqual(pstr.toString(), core_with_nl);
        assert.strictEqual(JSON.parse(JSON.stringify(core_with_nl)), core_with_nl);
        assert.strictEqual(JSON.parse(JSON.stringify(core_with_nl)), pstr.str);
        assert.strictEqual(JSON.stringify(pstr.str), core_nl_with_delims);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0]), '"a\\nb"');
        assert.strictEqual(is_str(values[0]), true);
        assert.strictEqual(new Str(core_nl_with_delims).str, core_nl_with_delims);
        const s = assert_str(values[0]);
        assert.strictEqual(s.str, core_with_nl);
        engine.release();
    });
    it("carriage", function () {
        const engine = create_engine();
        const { trees, errors } = engine.parse(core_cr_with_delims);

        assert.strictEqual(errors.length, 0);

        assert.strictEqual(trees.length, 1);
        const tree = trees[0];
        const pstr = assert_str(tree);
        assert.strictEqual(JSON.stringify(pstr.str).length, 6);
        //
        assert.strictEqual(core_with_cr.length, 3);
        assert.strictEqual(ccrstr.str.length, 3);
        // This should be 3.
        assert.strictEqual(pstr.str.length, 3);
        assert.strictEqual(core_cr_with_delims.length, 6); // end delimiters plus escaping of the newline
        assert.strictEqual(ccrstr.str, core_with_cr);
        // The parsed string does not have the un-escaped newline
        assert.strictEqual(pstr.str, core_with_cr);
        assert.strictEqual(pstr.str.toString(), core_with_cr);
        assert.strictEqual(pstr.toString(), core_with_cr);
        assert.strictEqual(JSON.parse(JSON.stringify(core_with_cr)), core_with_cr);
        assert.strictEqual(JSON.parse(JSON.stringify(core_with_cr)), pstr.str);
        assert.strictEqual(JSON.stringify(pstr.str), core_cr_with_delims);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0]), '"c\\rd"');
        assert.strictEqual(is_str(values[0]), true);
        assert.strictEqual(new Str(core_cr_with_delims).str, core_cr_with_delims);
        const s = assert_str(values[0]);
        assert.strictEqual(s.str, core_with_cr);
        engine.release();
    });
});
