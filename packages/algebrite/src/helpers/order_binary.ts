import { Sym } from "@stemcmicro/atoms";
import { ExprContext, SIGN_GT, SIGN_LT } from "@stemcmicro/context";
import { items_to_cons, U } from "@stemcmicro/tree";

/**
 * Ensures the ordering of binary products. There is no evaluation.
 */
export function order_binary(opr: Sym, lhs: U, rhs: U, $: Pick<ExprContext, "compareFn">): U {
    const compareFn = $.compareFn(opr);
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
