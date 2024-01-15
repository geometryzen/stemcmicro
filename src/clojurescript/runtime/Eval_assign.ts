import { is_sym, Sym } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { Stack } from "../../env/Stack";
import { setq } from "../../operators/assign/assign_any_any";
import { BCons } from "../../operators/helpers/BCons";
import { is_binop } from "../../operators/helpers/is_binop";
import { State } from "./Stepper";

function is_sym_any_any(expr: Cons): expr is BCons<Sym, U, U> {
    const opr = expr.car;
    if (is_sym(opr) && is_binop(expr)) {
        return true;
    }
    else {
        return false;
    }
}

function assert_sym_any_any(expr: Cons): BCons<Sym, U, U> {
    if (is_sym_any_any(expr)) {
        return expr;
    }
    else {
        throw new Error();
    }
}

/**
 *
 */
export function Eval_assign(expr: Cons, stack: Stack<State>, state: State): State | undefined {
    if (state.firstTime) {
        state.firstTime = false;
        // We MUST not evaluate the left hand side of the assignment.
        // We only evaluate the right hand side.
        return new State(expr.rhs, state.$);
    }
    stack.pop();
    const lhs = expr.lhs;
    const rhs = state.value;
    const value = setq(lhs, rhs, assert_sym_any_any(expr), state.$);
    stack.top.value = value;
    return void 0;
}
