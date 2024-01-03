import { assert } from "chai";
import { create_sym } from "math-expression-atoms";
import { cons, Cons, items_to_cons } from "math-expression-tree";
import { ExtensionEnv, LambdaExpr } from "../src/env/ExtensionEnv";
import { create_script_context } from "../src/runtime/script_engine";

const DRAW = create_sym('draw');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const draw_lambda: LambdaExpr = (argList: Cons, $: ExtensionEnv) => {
    return cons(DRAW, argList);
};

describe("draw", function () {
    it("A", function () {
        const lines: string[] = [
            `trace=1`,
            `f=sin(x)/x`,
            `yrange=[-1,1]`,
            `draw(f,x)`
        ];
        const engine = create_script_context({
            // ScriptContextOptions
        });
        engine.defineFunction(items_to_cons(DRAW), draw_lambda);
        const { values } = engine.executeScript(lines.join('\n'), {
            // ScriptExecuteOptions
        });
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(draw f x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "draw(f,x)");
        engine.release();
    });
});
