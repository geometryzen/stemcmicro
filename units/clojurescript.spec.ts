
import { assert } from "chai";
import { is_blade, is_boo, is_flt, is_rat, is_str, is_sym, is_tensor } from "math-expression-atoms";
import { is_cons, is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";
import { is_dictionary } from "../src/clojurescript/atoms/Dictionary";
import { SyntaxKind } from "../src/parser/parser";

describe("ClojureScript", function () {
    it("1", function () {
        const lines: string[] = [
            `1`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "1");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("-1", function () {
        const lines: string[] = [
            `-1`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "-1");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("--1", function () {
        const lines: string[] = [
            `--1`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "--1");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "--1");
        assert.strictEqual(is_rat(values[0]), false);
        assert.strictEqual(is_sym(values[0]), true);
        engine.release();
    });
    it("Flt", function () {
        const lines: string[] = [
            `1.0`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "1.0");
        assert.strictEqual(is_flt(values[0]), true);
        engine.release();
    });
    it("Str", function () {
        const lines: string[] = [
            `"Quick! Brown foxes!"`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `"Quick! Brown foxes!"`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `"Quick! Brown foxes!"`);
        assert.strictEqual(is_str(values[0]), true);
        engine.release();
    });
    it("Boo", function () {
        const lines: string[] = [
            `true`,
            `false`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 2);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `true`);
        assert.strictEqual(is_boo(values[0]), true);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), `false`);
        assert.strictEqual(is_boo(values[1]), true);
        engine.release();
    });
    it("Sym", function () {
        const lines: string[] = [
            `foo`,
            `foo-bar`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 2);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `foo`);
        assert.strictEqual(is_sym(values[0]), true);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), `foo-bar`);
        assert.strictEqual(is_sym(values[1]), true);
        engine.release();
    });
    it("Keyword", function () {
        const lines: string[] = [
            `:a-keyword`,
            `::namespaced-keyword`,
            `:explicit-ns/keyword`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 3);
        // Because we represent keywords as symbols, we lose the leading ':'.
        // Not clear whether we will continue with this approach.
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `a-keyword`);
        assert.strictEqual(is_sym(values[0]), true);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), `:cljs.user/namespaced-keyword`);
        assert.strictEqual(is_sym(values[1]), true);
        assert.strictEqual(engine.renderAsString(values[2], { format: 'Infix' }), `:explicit-ns/keyword`);
        assert.strictEqual(is_sym(values[2]), true);
        // assert.strictEqual(engine.renderAsString(values[3], { format: 'SExpr' }), `:explicit-ns/keyword`);
        // assert.strictEqual(is_keyword(values[3]), true);
        engine.release();
    });
    it("Lists", function () {
        const lines: string[] = [
            `(+ 1 2 3 4)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `10`);
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("Vectors", function () {
        const lines: string[] = [
            `["Alice" "Bob" "Carol"]`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `["Alice" "Bob" "Carol"]`);
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("Maps", function () {
        const lines: string[] = [
            `{:x a :y b}`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `{x a y b}`);
        assert.strictEqual(is_dictionary(values[0]), true);
        engine.release();
    });
    it("Evaluation", function () {
        const lines: string[] = [
            `(mk-sandwich "Bacon" "Lettuce" "Tomato")`,
            `(def x 5)`,
            `(if (even? 10) "Even" "Odd")`,
            `(+ 10 (* 5 2))`,
            `(* (+ 10 5) 2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 5);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `(mk-sandwich "Bacon" "Lettuce" "Tomato")`);
        assert.strictEqual(is_cons(values[0]), true);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'SExpr' }), `(def x 5)`);
        assert.strictEqual(is_cons(values[1]), true);
        assert.strictEqual(engine.renderAsString(values[2], { format: 'SExpr' }), `(if (even? 10) "Even" "Odd")`);
        assert.strictEqual(is_cons(values[2]), true);
        assert.strictEqual(engine.renderAsString(values[3], { format: 'SExpr' }), `20`);
        assert.strictEqual(is_rat(values[3]), true);
        assert.strictEqual(engine.renderAsString(values[4], { format: 'SExpr' }), `30`);
        assert.strictEqual(is_rat(values[4]), true);
        engine.release();
    });
    it("Maps", function () {
        const lines: string[] = [
            `{x a y b}`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `{x a y b}`);
        assert.strictEqual(is_dictionary(values[0]), true);
        engine.release();
    });
    it("Maps", function () {
        const lines: string[] = [
            `{:x a :y b}`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `{x a y b}`);
        assert.strictEqual(is_dictionary(values[0]), true);
        engine.release();
    });
    it("Tensors in Eigenmath", function () {
        const lines: string[] = [
            `["Alice", "Bob", "Carol"]`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `["Alice","Bob","Carol"]`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `["Alice" "Bob" "Carol"]`);
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("Vectors in ClojureScript", function () {
        const lines: string[] = [
            `["Alice" "Bob" "Carol"]`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `["Alice","Bob","Carol"]`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `["Alice" "Bob" "Carol"]`);
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("algebra", function () {
        const lines: string[] = [
            `(= G30 (algebra [1 1 1] ["e1" "e2" "e3"]))`,
            `(= e1 (component G30 1))`,
            `(= e2 (component G30 2))`,
            `e1`,
            `e2`,
            `(<< e1 e1)`,
            `(<< e1 e2)`,
            `(outer e1 e2)`,
            `(^ e1 e2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 6);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "e1");
        assert.strictEqual(is_blade(values[0]), true);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), "e2");
        assert.strictEqual(is_blade(values[1]), true);
        assert.strictEqual(engine.renderAsString(values[2], { format: 'Infix' }), "1");
        assert.strictEqual(is_rat(values[2]), true);
        assert.strictEqual(engine.renderAsString(values[3], { format: 'Infix' }), "0");
        assert.strictEqual(is_rat(values[3]), true);
        assert.strictEqual(engine.renderAsString(values[4], { format: 'Infix' }), "e1^e2");
        assert.strictEqual(is_blade(values[4]), true);
        assert.strictEqual(engine.renderAsString(values[5], { format: 'Infix' }), "e1^e2");
        assert.strictEqual(is_blade(values[5]), true);
        engine.release();
    });
    it("wedge", function () {
        const lines: string[] = [
            `(= G30 (algebra [1 1 1] ["e1" "e2" "e3"]))`,
            `(= e1 (component G30 1))`,
            `(= e2 (component G30 2))`,
            `(^ e1 e2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "e1^e2");
        assert.strictEqual(is_blade(values[0]), true);
        engine.release();
    });
    it("vbar", function () {
        const lines: string[] = [
            `(= G30 (algebra [1 1 1] ["e1" "e2" "e3"]))`,
            `(= e1 (component G30 1))`,
            `(= e2 (component G30 2))`,
            `(| e1 e1)`,
            `(| e1 e2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 2);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "1");
        assert.strictEqual(is_rat(values[0]), true);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), "0");
        assert.strictEqual(is_rat(values[1]), true);
        engine.release();
    });
});