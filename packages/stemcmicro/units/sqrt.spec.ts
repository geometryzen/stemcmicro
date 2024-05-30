import assert from "assert";
import { is_nil, U } from "@stemcmicro/tree";
import { create_engine, ExprEngine } from "../src/api/api";
import { SyntaxKind } from "../src/parser/parser";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sqrt", function () {
    it("(a) should be converted to a power expression", function () {
        const lines: string[] = [`sqrt(a)`];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(pow a 1/2)");
        assert.strictEqual(engine.renderAsInfix(actual), "a**(1/2)");
        engine.release();
    });
    xit("sqrt(49*m*m) using Eigenmath", function () {
        const lines: string[] = [`sqrt(49*m*m)`];
        const sourceText = lines.join("\n");
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Eigenmath });
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
        assert.strictEqual(engine.renderAsString(values[0], { format: "Ascii" }), "7 m");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Human" }), "7 m");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Infix" }), "7 m");
        assert.strictEqual(engine.renderAsString(values[0], { format: "LaTeX" }), "7 m");
        assert.strictEqual(engine.renderAsString(values[0], { format: "SExpr" }), "(* 7 m)");
        engine.release();
    });
    it("sqrt(49*m*m) using Native", function () {
        const lines: string[] = [`sqrt(49*m*m)`];
        const sourceText = lines.join("\n");
        const engine: ExprEngine = create_engine();
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
        assert.strictEqual(engine.renderAsString(values[0], { format: "Ascii" }), "7 m");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Human" }), "7 m");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Infix" }), "7*m");
        assert.strictEqual(engine.renderAsString(values[0], { format: "LaTeX" }), "7m");
        assert.strictEqual(engine.renderAsString(values[0], { format: "SExpr" }), "(* 7 m)");
        engine.release();
    });
    xit("sqrt(49*m*m) using Eigenmath", function () {
        const lines: string[] = [`sqrt(49*m*m)`];
        const sourceText = lines.join("\n");
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Eigenmath });
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
        assert.strictEqual(engine.renderAsString(values[0], { format: "Ascii" }), "7 m");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Human" }), "7 m");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Infix" }), "7 m");
        assert.strictEqual(engine.renderAsString(values[0], { format: "LaTeX" }), "7 m");
        assert.strictEqual(engine.renderAsString(values[0], { format: "SExpr" }), "(* 7 m)");
        engine.release();
    });
    it("sqrt(x**y) using Eigenmath", function () {
        // Eigenmath simply assumes that all symbols are nonnegative real numbers.
        // Under such conditions (b**r)**s = b**(r*s).
        // Hence sqrt(x**y) = (x**y)**(1/2) = x**(y * 1/2) = x**(1/2 * y).
        const lines: string[] = [`sqrt(x^y)`];
        const sourceText = lines.join("\n");
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Eigenmath });
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
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), "     1/2\n^(x,y)");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Human" }), "(x ^ y)**(1/2)");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Infix" }), "x**(1/2 y)");
        assert.strictEqual(engine.renderAsString(values[0], { format: "LaTeX" }), "x^{\\frac{y}{2}}");
        assert.strictEqual(engine.renderAsString(values[0], { format: "SExpr" }), "(pow x (* 1/2 y))");
        engine.release();
    });
    xit("sqrt(x**y) using Native", function () {
        // Eigenmath simply assumes that all symbols are nonnegative real numbers.
        // Under such conditions (b**r)**s = b**(r*s).
        // Hence sqrt(x**y) = (x**y)**(1/2) = x**(y * 1/2) = x**(1/2 * y).
        const lines: string[] = [`sqrt(x**y)`];
        const sourceText = lines.join("\n");
        const engine: ExprEngine = create_engine();
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
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), "x**(1/2 y)");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Human" }), "x**(1/2 y)");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Infix" }), "x**(1/2*y)");
        assert.strictEqual(engine.renderAsString(values[0], { format: "LaTeX" }), "x^{\\frac{y}{2}}");
        assert.strictEqual(engine.renderAsString(values[0], { format: "SExpr" }), "(pow x (* 1/2 y))");
        engine.release();
    });
    xit("sqrt(49*m*m) using Native", function () {
        const lines: string[] = [`sqrt(49*m*m)`];
        const sourceText = lines.join("\n");
        const engine: ExprEngine = create_engine();
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
        assert.strictEqual(engine.renderAsString(values[0], { format: "Ascii" }), "7 m");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Human" }), "7 m");
        assert.strictEqual(engine.renderAsString(values[0], { format: "Infix" }), "7*m");
        assert.strictEqual(engine.renderAsString(values[0], { format: "LaTeX" }), "7m");
        assert.strictEqual(engine.renderAsString(values[0], { format: "SExpr" }), "(* 7 m)");
        engine.release();
    });
});
