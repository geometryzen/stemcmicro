import { is_program, Node, Program } from "@geometryzen/esprima";
import { Stack } from "@stemcmicro/stack";
import { items_to_cons, nil, U } from "@stemcmicro/tree";
import { State } from "./State";

function assert_program(node: Node): Program | never {
    if (is_program(node)) {
        return node;
    } else {
        throw new Error();
    }
}

export function step_program(stack: Stack<State>, state: State): State | null {
    const program = assert_program(state.node);
    const body = program.body;
    const n = body.length;
    if (state.firstTime) {
        state.firstTime = false;
        state.done = Array<boolean>(n).fill(false);
        state.parts = Array<U>(n).fill(nil);
    }
    for (let i = 0; i < n; i++) {
        if (state.done[i]) {
            // Nothing to do but check the next one
        } else {
            state.done[i] = true;
            if (i > 0) {
                state.parts[i - 1] = state.value;
            }
            return new State(body[i], state.scope);
        }
    }
    if (n > 0) {
        state.parts[n - 1] = state.value;
    }
    // When we are done.
    stack.pop();
    const value = items_to_cons(...state.parts);
    stack.top.value = value;
    return null;
}
