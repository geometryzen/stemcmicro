import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_any } from "../helpers/is_any";
import { is_sym } from "../sym/is_sym";
import { is_add_2_any_any } from "./is_add_2_any_any";

export function is_add_2_any_sym(expr: Cons): expr is Cons2<Sym, U, Sym> {
    if (is_add_2_any_any(expr)) {
        const lhs = expr.lhs;
        const rhs = expr.rhs;
        return is_any(lhs) && is_sym(rhs);
    }
    else {
        return false;
    }
}