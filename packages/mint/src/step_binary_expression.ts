import { BinaryExpression, is_binary_expression, Node } from "@geometryzen/esprima";
import { ExprHandler } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { Stack } from "@stemcmicro/stack";
import { Atom, is_atom, is_nil, items_to_cons, nil, U } from "@stemcmicro/tree";
import { State } from "./State";
const ADD = native_sym(Native.add);
function assert_binary_expression(node: Node): BinaryExpression | never {
    if (is_binary_expression(node)) {
        return node;
    } else {
        throw new Error();
    }
}

export function step_binary_expression(stack: Stack<State>, state: State): State | null {
    const expr = assert_binary_expression(state.node);
    const n = 2;
    if (state.firstTime) {
        state.firstTime = false;
        state.done = Array<boolean>(n).fill(false);
        state.parts = Array<U>(n).fill(nil);
    }
    for (let i = 0; i < n; i++) {
        switch (i) {
            case 0: {
                if (state.done[i]) {
                    // Nothing to do but check the next one
                } else {
                    state.done[i] = true;
                    return new State(expr.left, state.scope);
                }
                break;
            }
            case 1: {
                if (state.done[i]) {
                    // Nothing to do but check the next one
                } else {
                    state.parts[0] = state.value;
                    state.done[i] = true;
                    return new State(expr.right, state.scope);
                }
                break;
            }
        }
    }
    if (n > 0) {
        state.parts[n - 1] = state.value;
    }
    stack.pop();
    // We now have the evaluated arguments.
    switch (expr.operator) {
        case "+": {
            const lhs = state.parts[0];
            const rhs = state.parts[1];
            if (is_atom(lhs) && is_atom(rhs)) {
                const scope = state.scope;
                const lhsExt: ExprHandler<Atom> = scope.handlerFor(lhs); // Assume that for atoms an extension can be found.
                const rhsExt: ExprHandler<Atom> = scope.handlerFor(rhs); // Assume that for atoms an extension can be found.
                const sumLhs = lhsExt.binL(lhs, ADD, rhs, scope);
                if (is_nil(sumLhs)) {
                    const sumRhs = rhsExt.binR(rhs, ADD, lhs, scope);
                    if (is_nil(sumRhs)) {
                        stack.top.value = items_to_cons(ADD, lhs, rhs);
                    } else {
                        stack.top.value = sumRhs;
                    }
                } else {
                    stack.top.value = sumLhs;
                }
            }
            return null;
        }
        default: {
            throw new Error(expr.operator);
        }
    }
    return null;
}
