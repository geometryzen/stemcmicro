import { Cons, U } from "../../tree/tree";
import { BCons } from "./BCons";

export function is_binop(expr: Cons): expr is BCons<U, U, U> {
    return expr.length === 3;
}
