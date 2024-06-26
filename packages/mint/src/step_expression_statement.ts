import { Directive, ExpressionStatement, is_expression_statement, Node } from "@geometryzen/esprima";
import { Stack } from "@stemcmicro/stack";
import { nil, U } from "@stemcmicro/tree";
import { State } from "./State";

function assert_expression_statement(node: Node): Directive | ExpressionStatement | never {
    if (is_expression_statement(node)) {
        return node;
    } else {
        throw new Error();
    }
}

export function step_expression_statement(stack: Stack<State>, state: State): State | null {
    const stmt = assert_expression_statement(state.node);
    const expr = stmt.expression;
    const n = 1;
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
            return new State(expr, state.scope);
        }
    }
    if (n > 0) {
        state.parts[n - 1] = state.value;
    }
    stack.pop();
    stack.top.value = state.parts[0];
    return null;
}
