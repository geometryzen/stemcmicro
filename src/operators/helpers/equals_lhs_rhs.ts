import { Cons } from "../../tree/tree";

export function equals_lhs_rhs(expr: Cons): boolean {
    return expr.lhs.equals(expr.rhs);
}