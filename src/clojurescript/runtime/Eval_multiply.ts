import { Cons, items_to_cons, nil, U } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { multiply_values } from "../../operators/mul/Eval_multiply";
import { State } from "./Interpreter";

export function Eval_multiply(expr: Cons, stack: State[], state: State, $: ExtensionEnv): State | undefined {
    const args: Cons = expr.argList;
    const n = args.length;
    if (state.firstTime) {
        state.firstTime = false;
        state.doneArg = Array<boolean>(n).fill(false);
        state.argValues = Array<U>(n).fill(nil);
    }
    for (let i = 0; i < n; i++) {
        if (!state.doneArg[i]) {
            state.doneArg[i] = true;
            if (i > 0) {
                state.argValues[i - 1] = state.value;
            }
            return new State(args.item(i), state.scope);
        }
    }
    if (n > 0) {
        state.argValues[n - 1] = state.value;
    }
    stack.pop();
    const vals: Cons = items_to_cons(...state.argValues);
    const value = multiply_values(vals, expr, $);
    stack[stack.length - 1].value = value;
}
