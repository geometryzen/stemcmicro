import { Cons2 } from "./ConsN";
import { Cons, U } from "./tree";

export function is_cons2(expr: Cons): expr is Cons2<U, U, U> {
    return expr.length === 3;
}
