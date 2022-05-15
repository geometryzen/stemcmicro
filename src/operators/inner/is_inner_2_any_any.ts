import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_binop } from "../helpers/is_binop";
import { is_inner } from "./is_inner";

export function is_inner_2_any_any(expr: Cons): expr is BCons<Sym, U, U> {
    return is_inner(expr) && is_binop(expr);
}
