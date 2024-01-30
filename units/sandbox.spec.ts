
import { assert } from "chai";
import { is_rat } from "math-expression-atoms";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";
import { SyntaxKind } from "../src/parser/parser";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("def [symbol]", function () {
        const lines: string[] = [
            `(def a)`,
            `a`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            values.push(value);
        }
        assert.strictEqual(values.length, 2);
        // console.lg(`${values[0]}`);
        // console.lg(`${values[1]}`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "()");
        assert.strictEqual(is_nil(values[0]), true);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'SExpr' }), "()");
        assert.strictEqual(is_nil(values[1]), true);
        engine.release();
    });
    it("a", function () {
        const lines: string[] = [
            `a`
        ];
        const engine = create_script_context();
        const { values, prints, errors } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(prints.length, 0);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "a");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a");

        engine.release();
    });
    it("d", function () {
        const lines: string[] = [
            `d`
        ];
        const engine = create_script_context();
        const { values, prints, errors } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(prints.length, 0);
        assert.strictEqual(values.length, 1);

        // const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(engine.renderAsSExpr(actual), "d");
        // assert.strictEqual(engine.renderAsInfix(actual), "d");

        engine.release();
    });
    xit("a+b+c+d+e", function () {
        const lines: string[] = [
            `a+b+c+d+e`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b c d e)");
        assert.strictEqual(engine.renderAsInfix(actual), "a+b+c+d+e");

        engine.release();
    });
    xit("def [symbol]", function () {
        const lines: string[] = [
            `(def a)`,
            `a`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            values.push(value);
        }
        // console.lg(`${values[0]}`);
        assert.strictEqual(values.length, 2);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "()");
        assert.strictEqual(is_nil(values[0]), true);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'SExpr' }), "()");
        assert.strictEqual(is_nil(values[1]), true);
        engine.release();
    });
    xit("OK", function () {
        const lines: string[] = [
            `(let [num 23] num)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "23");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    xit("OK", function () {
        const lines: string[] = [
            `(let [num 23] (* 2 num))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        // console.lg(`${values[0]}`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "46");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    xit("OK?", function () {
        const lines: string[] = [
            `(def cell (atom 3))`,
            `(let [num 23] (deref cell))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "23");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
});