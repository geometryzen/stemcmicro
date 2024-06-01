import { Cons, Cons2, U } from "@stemcmicro/tree";

/**
 * TODO: Rename is_cons2?
 */
export function is_binop(expr: Cons): expr is Cons2<U, U, U> {
    return expr.length === 3;
}
