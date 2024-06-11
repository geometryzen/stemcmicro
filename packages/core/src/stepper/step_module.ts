import { Stack } from "@stemcmicro/eigenmath";
import { Cons, nil, U } from "@stemcmicro/tree";
import { State } from "./Stepper";

export function step_module(expr: Cons, stack: Stack<State>, state: State): State | undefined {
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
    state.done = true;
    stack.top.inputs = [...args];
    stack.top.values = state.argValues;
    // Don't pop the stateStack.
    // Leave the root scope on the tree in case the program is appended to.
    return void 0;
}
