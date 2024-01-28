import { Cons, U } from "../../tree/tree";
import { Cons2 } from "./Cons2";

export function is_binop(expr: Cons): expr is Cons2<U, U, U> {
    return expr.length === 3;
}
