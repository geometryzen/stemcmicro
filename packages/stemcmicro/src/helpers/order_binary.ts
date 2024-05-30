import { Sym } from "math-expression-atoms";
import { ExprContext, SIGN_GT, SIGN_LT } from "math-expression-context";
import { items_to_cons, U } from "math-expression-tree";

/**
 * Ensures the ordering of binary products. There is no evaluation.
 */
export function order_binary(opr: Sym, lhs: U, rhs: U, _: Pick<ExprContext, "compareFn">): U {
    const compareFn = _.compareFn(opr);
    switch (compareFn(lhs, rhs)) {
        case SIGN_LT: {
            return items_to_cons(opr, lhs, rhs);
        }
        case SIGN_GT: {
            return items_to_cons(opr, rhs, lhs);
        }
        default: {
            return items_to_cons(opr, lhs, rhs);
        }
    }
}
