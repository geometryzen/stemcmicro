import { ExprContext } from "@stemcmicro/context";
import { Stack } from "@stemcmicro/stack";
import { Cons, items_to_cons, nil, U } from "@stemcmicro/tree";
import { StepFunction } from "./StepFunction";
import { State } from "./Stepper";

export function step_from_eval_function(evalFunction: (expe: Cons, context: ExprContext) => U): StepFunction {
    return function step_v_args(expr: Cons, stack: Stack<State>, state: State): State | undefined {
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
        const value = evalFunction(items_to_cons(expr.opr, ...state.argValues), state.scope);
        stack.top.value = value;
        return void 0;
    };
}
