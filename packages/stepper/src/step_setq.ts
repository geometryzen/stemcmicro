import { is_sym, Sym } from "@stemcmicro/atoms";
import { define_function, setq_indexed } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Stack } from "@stemcmicro/stack";
import { Cons, Cons2, is_cons, is_cons2, nil, U } from "@stemcmicro/tree";
import { State } from "./Stepper";

const COMPONENT = native_sym(Native.component);

function is_sym_any_any(expr: Cons): expr is Cons2<Sym, U, U> {
    const opr = expr.car;
    if (is_sym(opr) && is_cons2(expr)) {
        return true;
    } else {
        return false;
    }
}

export function assert_sym_any_any(expr: Cons): Cons2<Sym, U, U> {
    if (is_sym_any_any(expr)) {
        return expr;
    } else {
        throw new Error();
    }
}

type LHS = U;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * This stepper function for assignment is special in that the LHS of the assignment is not evaluated.
 */
export function step_setq(x: Cons, stack: Stack<State>, state: State): State | undefined {
    const expr: EXP = assert_sym_any_any(x);
    const lhs = expr.lhs;
    if (is_cons(lhs)) {
        // case of assigning to an element of a tensor.
        if (lhs.opr.equals(COMPONENT)) {
            stack.pop();
            stack.top.value = setq_indexed(expr, state.scope);
            return void 0;
        } else {
            // case of function definition.
            stack.pop();
            stack.top.value = define_function(expr, state.scope);
            return void 0;
        }
    }

    if (!is_sym(lhs)) {
        throw new Error("symbol assignment: error in symbol");
    }

    // We don't have to evaluate the RHS if this is either:
    // - assignment to an element of a tensor, or
    // - a function definition.
    if (state.firstTime) {
        state.firstTime = false;

        // We MUST not evaluate the left hand side of the assignment.
        // We only evaluate the right hand side.
        return new State(expr.rhs, state.scope);
    }
    stack.pop();
    const scope = state.scope;
    scope.setBinding(lhs, state.value);
    scope.setUserFunction(lhs, nil);
    stack.top.value = nil;
    return void 0;
}
