import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { items_to_cons, U } from "math-expression-tree";

/**
 * Constructs a binary expression and evaluates it.
 * The arguments are not evaluated.
 * @param opr The symbol in the position of the zeroth element of the list.
 * @param lhs The expression in the first element of the list.
 * @param rhs The expression in the second element of the list.
 */
export function binop(opr: U, lhs: U, rhs: U, $: Pick<ExprContext, "valueOf">): U {
    const expr = items_to_cons(opr, lhs, rhs);
    try {
        return $.valueOf(expr);
    } finally {
        expr.release();
    }
}

/**
 * Constructs a binary expression and evaluates it.
 * WARNING: This may be slower than caching the symbol for the operator.
 * The arguments are not evaluated.
 * @param opr The symbol in the position of the zeroth element of the list.
 * @param lhs The expression in the first element of the list.
 * @param rhs The expression in the second element of the list.
 */
export function native_binop(opr: Native, lhs: U, rhs: U, $: Pick<ExprContext, "valueOf">): U {
    return binop(native_sym(opr), lhs, rhs, $);
}
