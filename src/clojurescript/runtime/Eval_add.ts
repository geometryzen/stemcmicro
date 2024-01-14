import { Native } from "math-expression-native";
import { Cons, nil, U } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { State } from "./Interpreter";

export function Eval_add(expr: Cons, stack: State[], state: State, $: ExtensionEnv): State | undefined {
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
    const value = $.evaluate(Native.add, ...state.argValues);
    stack[stack.length - 1].value = value;
}
