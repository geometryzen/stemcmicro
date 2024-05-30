import { is_sym, Sym } from "@stemcmicro/atoms";
import { Cons, is_cons, nil, U } from "@stemcmicro/tree";
import { Stack } from "../../env/Stack";
import { define_function } from "../../operators/assign/define_function";
import { setq_indexed } from "../../operators/assign/setq_indexed";
import { Cons2 } from "../../operators/helpers/Cons2";
import { is_binop } from "../../operators/helpers/is_binop";
import { COMPONENT } from "../../runtime/constants";
import { halt } from "../../runtime/defs";
import { State } from "./Stepper";

function is_sym_any_any(expr: Cons): expr is Cons2<Sym, U, U> {
    const opr = expr.car;
    if (is_sym(opr) && is_binop(expr)) {
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
            stack.top.value = setq_indexed(expr, state.$);
            return void 0;
        } else {
            // case of function definition.
            stack.pop();
            stack.top.value = define_function(expr, state.$);
            return void 0;
        }
    }

    if (!is_sym(lhs)) {
        halt("symbol assignment: error in symbol");
    }

    // We don't have to evaluate the RHS if this is either:
    // - assignment to an element of a tensor, or
    // - a function definition.
    if (state.firstTime) {
        state.firstTime = false;

        // We MUST not evaluate the left hand side of the assignment.
        // We only evaluate the right hand side.
        return new State(expr.rhs, state.$);
    }
    stack.pop();
    const scope = state.$;
    scope.setBinding(lhs, state.value);
    scope.setUserFunction(lhs, nil);
    stack.top.value = nil;
    return void 0;
}
