import { Native } from "@stemcmicro/native";
import { Cons, nil, U } from "@stemcmicro/tree";
import { Stack } from "../../env/Stack";
import { State } from "./Stepper";

export function step_add(expr: Cons, stack: Stack<State>, state: State): State | undefined {
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
    const value = state.$.evaluate(Native.add, ...state.argValues);
    stack.top.value = value;
}
