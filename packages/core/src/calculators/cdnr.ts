import { Cons, is_cons, U } from "../tree/tree";

export function cdnr(expr: Cons, n: number): U {
    if (n > 0) {
        const argList = expr.argList;
        if (is_cons(argList)) {
            return cdnr(argList, n - 1);
        } else {
            return argList;
        }
    } else {
        return expr;
    }
}
