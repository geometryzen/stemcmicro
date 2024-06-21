import { Stack } from "@stemcmicro/stack";
import { Cons, nil, U } from "@stemcmicro/tree";
import { State } from "./Stepper";

export function step_module(expr: Cons, stack: Stack<State>, state: State): State | undefined {
    const argList: Cons = expr.argList;
    try {
        const n = argList.length;
        if (state.firstTime) {
            state.firstTime = false;
            state.doneArg = Array<boolean>(n).fill(false);
            state.argValues = Array<U>(n).fill(nil);
        }
        for (let i = 0; i < n; i++) {
            if (state.doneArg[i]) {
                // Do nothing or go onto the next argument.
                continue;
            } else {
                state.doneArg[i] = true;
                if (i > 0) {
                    state.argValues[i - 1] = state.value;
                }
                return new State(argList.item(i), state.scope);
            }
        }
        // We only end up here when all of the arguments have been processed.
        // Here we put the last argument value into its rightful place.
        if (n > 0) {
            state.argValues[n - 1] = state.value;
        }
        // Since we are handling the module, we are done.
        state.done = true;
        stack.top.inputs = [...argList];
        stack.top.values = state.argValues;
        // Don't pop the stateStack.
        // Leave the root scope on the tree in case the program is appended to.
        return void 0;
    } finally {
        argList.release();
    }
}
