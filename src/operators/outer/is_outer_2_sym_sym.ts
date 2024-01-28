import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_sym } from "../sym/is_sym";
import { is_outer_2_any_any } from "./is_outer_2_any_any";

export function is_outer_2_sym_sym(expr: Cons): expr is Cons2<Sym, Sym, Sym> {
    if (is_outer_2_any_any(expr)) {
        const lhs = expr.lhs;
        const rhs = expr.rhs;
        return is_sym(lhs) && is_sym(rhs);
    }
    else {
        return false;
    }
}