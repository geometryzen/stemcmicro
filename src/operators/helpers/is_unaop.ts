import { Cons, U } from "../../tree/tree";
import { Cons1 } from "./Cons1";

export function is_unaop(expr: Cons): expr is Cons1<U, U> {
    return expr.length === 2;
}
