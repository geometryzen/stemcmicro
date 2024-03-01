import { Cons, Cons1, U } from "math-expression-tree";

export function is_unaop(expr: Cons): expr is Cons1<U, U> {
    return expr.length === 2;
}
