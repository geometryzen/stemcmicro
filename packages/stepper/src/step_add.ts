import { equals_cons_array } from "@stemcmicro/helpers";
import { Stack } from "@stemcmicro/stack";
import { Cons, items_to_cons, nil, U } from "@stemcmicro/tree";
import { State } from "./Stepper";

export function step_add(expr: Cons, stack: Stack<State>, state: State): State | undefined {
    const argList: Cons = expr.argList;
    try {
        const n = argList.length;
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
                return new State(argList.item(i), state.scope);
            }
        }
        if (n > 0) {
            state.argValues[n - 1] = state.value;
        }
        stack.pop();
        // We can now compare argList and state.argValues
        // If there are no changes then we can go no further and return the values as a cons
        // otherwise, we return a new state
        const opr = expr.opr;
        try {
            const value = items_to_cons(opr, ...state.argValues);
            if (equals_cons_array(argList, state.argValues)) {
                // Evaluating the arguments produced no change
                stack.top.value = value;
                return void 0;
            } else {
                return new State(value, state.scope);
            }
        } finally {
            opr.release();
        }
    } finally {
        argList.release();
    }
}
