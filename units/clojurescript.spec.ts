
import { assert } from "chai";
import { is_blade, is_boo, is_flt, is_keyword, is_map, is_rat, is_str, is_sym, is_tensor } from "math-expression-atoms";
import { is_cons, is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine, UndeclaredVars } from "../src/api/api";
import { SyntaxKind } from "../src/parser/parser";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_cons } from "../src/tree/cons/assert_cons";

describe("ClojureScript", function () {
    it("123", function () {
        const lines: string[] = [
            `    123    `
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "123");
        assert.strictEqual(is_rat(values[0]), true);
        const I0 = values[0];
        if (is_rat(I0)) {
            const pos = sourceText.indexOf('1');
            const end = pos + sourceText.trim().length;
            assert.strictEqual(I0.pos, pos, "pos");
            assert.strictEqual(I0.end, end, "end");
        }
        engine.release();
    });
    it("-123", function () {
        const lines: string[] = [
            `    -123    `
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "-123");
        assert.strictEqual(is_rat(values[0]), true);
        const I0 = values[0];
        if (is_rat(I0)) {
            const pos = sourceText.indexOf('-');
            const end = pos + sourceText.trim().length;
            assert.strictEqual(I0.pos, pos, "pos");
            assert.strictEqual(I0.end, end, "end");
        }
        engine.release();
    });
    it("--1", function () {
        const lines: string[] = [
            `    --1       `
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ allowUndeclaredVars: UndeclaredVars.Nil, syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "--1");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "--1");
        assert.strictEqual(is_rat(values[0]), false);
        assert.strictEqual(is_sym(values[0]), true);
        const I0 = values[0];
        if (is_sym(I0)) {
            const pos = sourceText.indexOf('-');
            const end = pos + sourceText.trim().length;
            assert.strictEqual(I0.pos, pos, "pos");
            assert.strictEqual(I0.end, end, "end");
        }
        engine.release();
    });
    it("Flt", function () {
        const lines: string[] = [
            `    3.14159   `
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "3.14159");
        assert.strictEqual(is_flt(values[0]), true);
        const I0 = values[0];
        if (is_flt(I0)) {
            const pos = sourceText.indexOf('3');
            const end = pos + sourceText.trim().length;
            assert.strictEqual(I0.pos, pos, "pos");
            assert.strictEqual(I0.end, end, "end");
        }
        engine.release();
    });
    it("Str", function () {
        const lines: string[] = [
            `      "Hello"    `
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `"Hello"`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `"Hello"`);
        assert.strictEqual(is_str(values[0]), true);
        const I0 = values[0];
        if (is_str(I0)) {
            const pos = sourceText.indexOf('"');
            const end = pos + sourceText.trim().length;
            assert.strictEqual(I0.pos, pos, "pos");
            assert.strictEqual(I0.end, end, "end");
        }
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
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 2);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `true`);
        assert.strictEqual(is_boo(values[0]), true);
        const I0 = values[0];
        if (is_boo(I0)) {
            assert.strictEqual(I0.pos, 0, "pos");
            assert.strictEqual(I0.end, 4, "end");
        }
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), `false`);
        assert.strictEqual(is_boo(values[1]), true);
        const I1 = values[1];
        if (is_boo(I1)) {
            assert.strictEqual(I1.pos, 5, "pos");
            assert.strictEqual(I1.end, 10, "end");
        }
        engine.release();
    });
    it("Sym", function () {
        const lines: string[] = [
            `foo`,
            `foo-bar`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ allowUndeclaredVars: UndeclaredVars.Nil, syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 2);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `foo`);
        assert.strictEqual(is_sym(values[0]), true);
        const I0 = values[0];
        if (is_sym(I0)) {
            assert.strictEqual(I0.pos, 0, "pos");
            assert.strictEqual(I0.end, 3, "end");
        }

        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), `foo-bar`);
        assert.strictEqual(is_sym(values[1]), true);
        const I1 = values[1];
        if (is_sym(I1)) {
            assert.strictEqual(I1.pos, 4, "pos");
            assert.strictEqual(I1.end, 11, "end");
        }

        engine.release();
    });
    it("Keyword", function () {
        const lines: string[] = [
            `:a-keyword`,
            `::namespaced-keyword`,
            `:ns/a`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 3);

        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `:a-keyword`);
        assert.strictEqual(is_keyword(values[0]), true);
        const I0 = values[0];
        if (is_keyword(I0)) {
            assert.strictEqual(I0.pos, 0, "pos");
            assert.strictEqual(I0.end, 10, "end");
        }

        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), `::namespaced-keyword`);
        assert.strictEqual(is_keyword(values[1]), true);
        const I1 = values[1];
        if (is_keyword(I1)) {
            assert.strictEqual(I1.pos, 11, "pos");
            assert.strictEqual(I1.end, 31, "end");
        }

        assert.strictEqual(engine.renderAsString(values[2], { format: 'Infix' }), `:ns/a`);
        assert.strictEqual(is_keyword(values[2]), true);
        const I2 = values[2];
        if (is_keyword(I2)) {
            assert.strictEqual(I2.pos, 32, "pos");
            assert.strictEqual(I2.end, 37, "end");
        }

        engine.release();
    });
    it("Lists", function () {
        const lines: string[] = [
            `    (    +    1    2    3    4    )   `
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(is_cons(trees[0]), true);
        const I0 = trees[0];
        if (is_keyword(I0)) {
            const pos = sourceText.indexOf('(');
            const end = pos + sourceText.trim().length;
            assert.strictEqual(I0.pos, pos, "pos");
            assert.strictEqual(I0.end, end, "end");
        }

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
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
            `  [  "Alice"    "Bob"   ]   `
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `["Alice" "Bob"]`);
        assert.strictEqual(is_tensor(values[0]), true);
        const I0 = values[0];
        if (is_tensor(I0)) {
            const pos = sourceText.indexOf('[');
            const end = pos + sourceText.trim().length;
            assert.strictEqual(I0.pos, pos, "pos");
            assert.strictEqual(I0.end, end, "end");
        }
        engine.release();
    });
    it("Maps", function () {
        const lines: string[] = [
            `    {   :x    a    :y    b   }    `
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `{:x a :y b}`);
        assert.strictEqual(is_map(values[0]), true);
        const I0 = values[0];
        if (is_map(I0)) {
            const pos = sourceText.indexOf('{');
            const end = pos + sourceText.trim().length;
            assert.strictEqual(I0.pos, pos, "pos");
            assert.strictEqual(I0.end, end, "end");
        }
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
        const engine: ExprEngine = create_engine({ allowUndeclaredVars: UndeclaredVars.Nil, syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 4);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `(mk-sandwich "Bacon" "Lettuce" "Tomato")`);
        assert.strictEqual(is_cons(values[0]), true);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'SExpr' }), `(if (even? 10) "Even" "Odd")`);
        assert.strictEqual(is_cons(values[1]), true);
        assert.strictEqual(engine.renderAsString(values[2], { format: 'SExpr' }), `20`);
        assert.strictEqual(is_rat(values[2]), true);
        assert.strictEqual(engine.renderAsString(values[3], { format: 'SExpr' }), `30`);
        assert.strictEqual(is_rat(values[3]), true);
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
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `{x a y b}`);
        assert.strictEqual(is_map(values[0]), true);
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
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `{:x a :y b}`);
        assert.strictEqual(is_map(values[0]), true);
        engine.release();
    });
    it("Tensors in STEMCscript", function () {
        const lines: string[] = [
            `["Alice", "Bob", "Carol"]`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
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
            const value = engine.valueOf(tree);
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
    xit("Tensors in Eigenmath", function () {
        const lines: string[] = [
            `["Alice", "Bob", "Carol"]`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Eigenmath });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `[Alice,Bob,Carol]`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `["Alice" "Bob" "Carol"]`);
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("algebra", function () {
        const lines: string[] = [
            `(= G30 (algebra [1 1 1] ["i" "j" "k"]))`,
            `(= e1 (component G30 1))`,
            `(= e2 (component G30 2))`,
            `(= e3 (component G30 3))`,
            `e1`,
            `e2`,
            `e3`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 3);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "i");
        assert.strictEqual(is_blade(values[0]), true);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), "j");
        assert.strictEqual(is_blade(values[1]), true);
        assert.strictEqual(engine.renderAsString(values[2], { format: 'Infix' }), "k");
        assert.strictEqual(is_blade(values[2]), true);
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
            const value = engine.valueOf(tree);
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
            const value = engine.valueOf(tree);
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
    it("atom", function () {
        const lines: string[] = [
            `(deref (atom 9))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), `(deref (atom 9))`);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "9");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("atom", function () {
        const lines: string[] = [
            `(def a (atom 3))`,
            `(reset! a 9)`,
            `(deref a)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 3);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), `(def a (atom 3))`);
        assert.strictEqual(engine.renderAsString(trees[1], { format: 'SExpr' }), `(reset! a 9)`);
        assert.strictEqual(engine.renderAsString(trees[2], { format: 'SExpr' }), `(deref a)`);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "9");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("def [symbol init]", function () {
        const lines: string[] = [
            `(def a 1)`,
            `a`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "1");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
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
            const value = engine.valueOf(tree);
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
    it("defn", function () {
        const lines: string[] = [
            `(defn foo [x] (* 2 x))`,
            `(foo 7)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), `(defn foo [x] (* 2 x))`);
        assert.strictEqual(engine.renderAsString(trees[1], { format: 'SExpr' }), `(foo 7)`);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "14");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("defn", function () {
        const lines: string[] = [
            `(defn foo "doc-string" [x] (* 2 x))`,
            `(foo 7)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), `(defn foo "doc-string" [x] (* 2 x))`);
        assert.strictEqual(engine.renderAsString(trees[1], { format: 'SExpr' }), `(foo 7)`);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "14");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("defn", function () {
        const lines: string[] = [
            `(defn foo {} [x] (* 2 x))`,
            `(foo 7)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), `(defn foo {} [x] (* 2 x))`);
        assert.strictEqual(engine.renderAsString(trees[1], { format: 'SExpr' }), `(foo 7)`);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length > 0, true);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "14");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("defn", function () {
        const lines: string[] = [
            `(defn foo "doc-string" {} [x] (* 2 x))`,
            `(foo 7)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), `(defn foo "doc-string" {} [x] (* 2 x))`);
        assert.strictEqual(engine.renderAsString(trees[1], { format: 'SExpr' }), `(foo 7)`);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length > 0, true);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "14");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("defn", function () {
        const lines: string[] = [
            `(defn foo "doc-string" {} [x] {} (* 2 x))`,
            `(foo 7)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), `(defn foo "doc-string" {} [x] {} (* 2 x))`);
        assert.strictEqual(engine.renderAsString(trees[1], { format: 'SExpr' }), `(foo 7)`);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length > 0, true);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "14");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("defn", function () {
        const lines: string[] = [
            `(defn foo "doc-string" [x] {} (* 2 x))`,
            `(foo 7)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), `(defn foo "doc-string" [x] {} (* 2 x))`);
        assert.strictEqual(engine.renderAsString(trees[1], { format: 'SExpr' }), `(foo 7)`);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length > 0, true);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "14");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("defn", function () {
        const lines: string[] = [
            `(defn foo {} [x] {} (* 2 x))`,
            `(foo 7)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), `(defn foo {} [x] {} (* 2 x))`);
        assert.strictEqual(engine.renderAsString(trees[1], { format: 'SExpr' }), `(foo 7)`);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length > 0, true);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "14");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("fn [x] ...", function () {
        const lines: string[] = [
            `(def triple (fn [x] (* 3 x)))`,
            `(triple 7)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), `(def triple (fn [x] (* 3 x)))`);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'Infix' }), `def(triple,fn [x] -> 3*x)`);
        assert.strictEqual(engine.renderAsString(trees[1], { format: 'SExpr' }), `(triple 7)`);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "21");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("fn [x y] ...", function () {
        const lines: string[] = [
            `(def area (fn [x y] (* x y)))`,
            `(area 3 5)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), `(def area (fn [x y] (* x y)))`);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'Infix' }), `def(area,fn [x y] -> x*y)`);
        assert.strictEqual(engine.renderAsString(trees[1], { format: 'SExpr' }), `(area 3 5)`);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "15");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("((fn ...) args)", function () {
        const lines: string[] = [
            `((fn [x] (* 2 x)) 7)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
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
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "14");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("((fn ...) args)", function () {
        const lines: string[] = [
            `((fn [x y] (* x y)) 3 5)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
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
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "15");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("((fn ...) args)", function () {
        const lines: string[] = [
            `((fn [x y] (* x y)) a b)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ allowUndeclaredVars: UndeclaredVars.Nil, syntaxKind: SyntaxKind.ClojureScript });
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
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "(* a b)");
        assert.strictEqual(is_cons(values[0]), true);
        engine.release();
    });
    xit("BUG", function () {
        const lines: string[] = [
            `((fn [x y] (* x y)) (3 5) 7)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
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
        // https://clojurescript.io REPL returns
        // ERROR - 3.call is not a function
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "(* (3 5) 7)");
        assert.strictEqual(is_cons(values[0]), true);
        // (Sym("*") ((Rat(3) (Rat(5) ())) (Err(Str(Use of undeclared Var y.)) ())))
        // Because the function application has an incorrect number of arguments, the variable y is not being bound.
        // console.lg(`${values[0]}`);
        engine.release();
    });
    xit("BUG", function () {
        const lines: string[] = [
            `((fn [x y] (* x y)) (3 5))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
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
        // https://clojurescript.io REPL returns
        // ERROR - 3.call is not a function
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "(* (3 5) undefined)");
        assert.strictEqual(is_cons(values[0]), true);
        // (Sym("*") ((Rat(3) (Rat(5) ())) (Err(Str(Use of undeclared Var y.)) ())))
        // Because the function application has an incorrect number of arguments, the variable y is not being bound.
        // console.lg(`${values[0]}`);
        engine.release();
    });
    it("function", function () {
        const lines: string[] = [
            `(def triple (function (* 3 x) (x)))`,
            `(triple 7)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'Infix' }), `def(triple,function (x) -> 3*x)`);
        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), `(def triple (function (* 3 x) (x)))`);
        assert.strictEqual(engine.renderAsString(trees[1], { format: 'SExpr' }), `(triple 7)`);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "21");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("let", function () {
        const lines: string[] = [
            `(let [x 1 y x] y)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        try {
            const { trees, errors } = engine.parse(sourceText, {});
            assert.strictEqual(errors.length, 0);
            assert.strictEqual(trees.length, 1);
            const letExpr = assert_cons(trees[0]);
            assert.strictEqual(engine.renderAsString(letExpr, { format: 'Ascii' }), "let((x,1,y,x),y)");
            assert.strictEqual(engine.renderAsString(letExpr, { format: 'Human' }), "let([x,1,y,x],y)");
            assert.strictEqual(engine.renderAsString(letExpr, { format: 'Infix' }), "let([x,1,y,x],y)");
            assert.strictEqual(engine.renderAsString(letExpr, { format: 'LaTeX' }), "let(\\begin{bmatrix} x & 1 & y & x \\end{bmatrix},y)");
            assert.strictEqual(engine.renderAsString(letExpr, { format: 'SExpr' }), "(let [x 1 y x] y)");
            // assert.strictEqual(engine.renderAsString(letExpr, { format: 'SVG' }), "");
            const value = engine.valueOf(letExpr);
            assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "1");
        }
        finally {
            engine.release();
        }
    });
    it("let", function () {
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
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "23");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("let", function () {
        const lines: string[] = [
            `(let [num 23] (+ 2 num))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
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
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "25");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("let", function () {
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
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "46");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("let", function () {
        const lines: string[] = [
            `(def cell (atom 3))`,
            `(let [num 137] (reset! cell num))`,
            `(deref cell)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 3);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "137");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("quote", function () {
        const lines: string[] = [
            `(quote (1 2 3 4 5))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), "(quote (1 2 3 4 5))");
        assert.strictEqual(is_cons(trees[0]), true);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "(1 2 3 4 5)");
        assert.strictEqual(is_cons(values[0]), true);
        engine.release();
    });
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
            const value = engine.valueOf(tree);
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
});