import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_binop } from "../helpers/is_binop";
import { is_outer } from "./is_outer";

export function is_outer_2_any_any(expr: Cons): expr is BCons<Sym, U, U> {
    return is_outer(expr) && is_binop(expr);
}
