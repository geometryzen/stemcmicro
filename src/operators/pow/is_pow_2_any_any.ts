import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_binop } from "../helpers/is_binop";
import { is_pow } from "./is_pow";

export function is_pow_2_any_any(expr: Cons): expr is BCons<Sym, U, U> {
    return is_pow(expr) && is_binop(expr);
}
