import assert from "assert";
import { is_sym } from "@stemcmicro/atoms";
import { is_cons, U } from "@stemcmicro/tree";
import { create_engine, ExprEngine } from "../src/api/api";

describe("arctan", function () {
    it("sin(x)/cos(x)", function () {
        const lines: string[] = [`arctan(sin(x)/cos(x))`];
        const sourceText = lines.join("\n");
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: "Ascii" }), "x");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Human" }), "x");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Infix" }), "x");
        assert.strictEqual(engine.renderAsString(values[0], { format: "SExpr" }), "x");
        assert.strictEqual(is_sym(values[0]), true);
        engine.release();
    });
    it("arctan(x)", function () {
        const lines: string[] = [`arctan(1)`];
        const sourceText = lines.join("\n");
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: "Ascii" }), " 1\n--- pi\n 4");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Human" }), "1/4 pi");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Infix" }), "1/4*pi");
        assert.strictEqual(engine.renderAsString(values[0], { format: "SExpr" }), "(* 1/4 pi)");
        assert.strictEqual(is_cons(values[0]), true);
        engine.release();
    });
    it("arctan(y,x)", function () {
        const lines: string[] = [`arctan(1,0)`];
        const sourceText = lines.join("\n");
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: "Ascii" }), " 1\n--- pi\n 2");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Human" }), "1/2 pi");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Infix" }), "1/2*pi");
        assert.strictEqual(engine.renderAsString(values[0], { format: "SExpr" }), "(* 1/2 pi)");
        assert.strictEqual(is_cons(values[0]), true);
        engine.release();
    });
});
