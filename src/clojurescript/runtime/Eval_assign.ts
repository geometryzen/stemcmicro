import { Native } from "math-expression-native";
import { Cons, nil, U } from "math-expression-tree";
import { Stack } from "../../env/Stack";
import { State } from "./Interpreter";

/**
 * TODO:
 * We don't evaluate the LHS item(1).
 * We do evaluate the RHS item(2).
 */
export function Eval_assign(expr: Cons, stack: Stack<State>, state: State): State | undefined {
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
            return new State(args.item(i), state.$);
        }
    }
    if (n > 0) {
        state.argValues[n - 1] = state.value;
    }
    stack.pop();
    // Defaulting this way could cause the assignment to impact the wrong scope.
    const value = state.$.evaluate(Native.setq, ...state.argValues);
    stack.top.value = value;
}
