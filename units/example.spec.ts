
import { assert } from "chai";
import { is_rat } from "math-expression-atoms";
import { create_engine, ExprEngine } from "../src/api/index";
import { State, Stepper } from '../src/clojurescript/runtime/Stepper';
import { Stack } from "../src/env/Stack";

describe("example", function () {
    it("program", function () {
        const lines: string[] = [
            `(+ 1 2 3 4 5)`,
            `(+ 10 (* 5 2))`,
            `(* (+ 10 5) 2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useClojureScript: true });
        const { program, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const runner = new Stepper(program);
        runner.run();
        const stack: Stack<State> = runner.getStateStack();
        assert.strictEqual(stack.length, 1);
        const values = stack.top.values;
        assert.strictEqual(values.length, 3);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "15");
        assert.strictEqual(is_rat(values[0]), true);
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), "20");
        assert.strictEqual(is_rat(values[1]), true);
        assert.strictEqual(engine.renderAsString(values[2], { format: 'Infix' }), "30");
        assert.strictEqual(is_rat(values[2]), true);
        engine.release();
    });
});