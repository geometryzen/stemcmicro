
import { assert } from "chai";
import { is_cons, is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine, UndeclaredVars } from "../src/api/index";
import { is_rat } from "../src/operators/rat/rat_extension";
import { SyntaxKind } from "../src/parser/parser";

describe("sandbox", function () {
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
            const value = engine.evaluate(tree);
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
            const value = engine.evaluate(tree);
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
            const value = engine.evaluate(tree);
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
            const value = engine.evaluate(tree);
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
            const value = engine.evaluate(tree);
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
});