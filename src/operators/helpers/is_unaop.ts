import { Cons, U } from "../../tree/tree";
import { UCons } from "./UCons";

export function is_unaop(expr: Cons): expr is UCons<U, U> {
    return expr.length === 2;
}
