import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_sym } from "../sym/is_sym";
import { is_inner_2_any_any } from "./is_inner_2_any_any";

export function is_inner_2_sym_sym(expr: Cons): expr is BCons<Sym, Sym, Sym> {
    if (is_inner_2_any_any(expr)) {
        const lhs = expr.lhs;
        const rhs = expr.rhs;
        return is_sym(lhs) && is_sym(rhs);
    }
    else {
        return false;
    }
}