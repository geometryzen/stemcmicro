
import { assert } from "chai";
import { assert_str, is_sym } from "math-expression-atoms";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine, UndeclaredVars } from "../src/api/index";
import { assert_err, is_err } from "../src/operators/err/is_err";
import { SyntaxKind } from "../src/parser/parser";

describe("ClojureScript", function () {
    it("Use of undeclared Var in Algebrite", function () {
        const lines: string[] = [
            `a`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
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
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "a");
        assert.strictEqual(is_sym(values[0]), true);
        engine.release();
    });
    it("Use of undeclared Var in ClojureScript allowUndeclaredVars=Nil", function () {
        const lines: string[] = [
            `a`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ allowUndeclaredVars: UndeclaredVars.Nil, syntaxKind: SyntaxKind.ClojureScript });
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
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "a");
        assert.strictEqual(is_sym(values[0]), true);
        engine.release();
    });
    it("Use of undeclared Var in ClojureScript allowUndeclaredVars:Err", function () {
        const lines: string[] = [
            `a`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ allowUndeclaredVars: UndeclaredVars.Err, syntaxKind: SyntaxKind.ClojureScript });
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
        const err = assert_err(values[0]);
        // Printing has troble with errors right now.
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "a");
        assert.strictEqual(is_err(err), true);
        const cause = assert_str(err.cause);
        assert.strictEqual(engine.renderAsString(cause, { format: 'SExpr' }), `"Use of undeclared Var a."`);
        engine.release();
    });
    it("Use of undeclared Var in ClojureScript (allowUndeclaredVars default)", function () {
        const lines: string[] = [
            `a`,
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
        const err = assert_err(values[0]);
        // Printing has troble with errors right now.
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "a");
        assert.strictEqual(is_err(err), true);
        const cause = assert_str(err.cause);
        assert.strictEqual(engine.renderAsString(cause, { format: 'SExpr' }), `"Use of undeclared Var a."`);
        engine.release();
    });
    it("Use of undeclared Var in Eigenmath", function () {
        const lines: string[] = [
            `a`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Eigenmath });
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
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "a");
        assert.strictEqual(is_sym(values[0]), true);
        engine.release();
    });
});