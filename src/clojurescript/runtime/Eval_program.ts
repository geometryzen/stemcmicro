import { Cons, is_nil } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { State } from "./Interpreter";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Eval_program(node: Cons, stack: State[], state: State, $: ExtensionEnv): State | undefined {
    // The first time we are called, state.started will be false.
    if (state.firstTime) {
        state.firstTime = false;
        const expression = node.arg;
        if (is_nil(expression)) {
            state.done = true;
        }
        else {
            state.done = false;
            return new State(expression, state.scope);
        }
    }
    else {
        // We'll ony process the first argument.
        state.done = true;
    }
}
