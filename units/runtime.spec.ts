
import { assert } from "chai";
import { is_rat, is_sym } from "math-expression-atoms";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";
import { State, Stepper } from '../src/clojurescript/runtime/Stepper';
import { Stack } from "../src/env/Stack";
import { SyntaxKind } from "../src/parser/parser";

describe("runtime", function () {
    it("+", function () {
        const lines: string[] = [
            `(+ 1 2 3 4 5)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        const runner = new Stepper(module);
        runner.run();
        const stack = runner.stack;
        assert.strictEqual(stack.length, 1);
        const value = stack.top.value;
        /*
        const value = engine.evaluate(tree);
        */
        if (!is_nil(value)) {
            values.push(value);
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "15");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("*", function () {
        const lines: string[] = [
            `(* 1 2 3 4 5)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        const runner = new Stepper(module);
        runner.run();
        const stack = runner.stack;
        assert.strictEqual(stack.length, 1);
        const value = stack.top.value;
        /*
        const value = engine.evaluate(tree);
        */
        if (!is_nil(value)) {
            values.push(value);
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "120");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("(+ ... (* ...))", function () {
        const lines: string[] = [
            `(+ 10 (* 5 2))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        const runner = new Stepper(module);
        runner.run();
        const stack = runner.stack;
        assert.strictEqual(stack.length, 1);
        const value = stack.top.value;
        /*
        const value = engine.evaluate(tree);
        */
        if (!is_nil(value)) {
            values.push(value);
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "20");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("(* ... (+ ...))", function () {
        const lines: string[] = [
            `(* (+ 10 5) 2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        const runner = new Stepper(module);
        runner.run();
        const stack = runner.stack;
        assert.strictEqual(stack.length, 1);
        const value = stack.top.value;
        /*
        const value = engine.evaluate(tree);
        */
        if (!is_nil(value)) {
            values.push(value);
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "30");
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("program returning multiple values", function () {
        const lines: string[] = [
            `a`,
            `b`,
            `c`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const runner = new Stepper(module);
        runner.run();
        const stack: Stack<State> = runner.stack;
        assert.strictEqual(stack.length, 1);
        const values = stack.top.values;
        assert.strictEqual(values.length, 3);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "a");
        assert.strictEqual(is_sym(values[0]), true);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), "b");
        assert.strictEqual(is_sym(values[1]), true);
        assert.strictEqual(engine.renderAsString(values[2], { format: 'Infix' }), "c");
        assert.strictEqual(is_sym(values[2]), true);
        engine.release();
    });

});