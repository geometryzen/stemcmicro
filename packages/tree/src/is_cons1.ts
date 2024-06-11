import { Cons1 } from "./ConsN";
import { Cons, U } from "./tree";

export function is_cons1(expr: Cons): expr is Cons1<U, U> {
    return expr.length === 1;
}
