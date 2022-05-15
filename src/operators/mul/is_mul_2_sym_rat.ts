import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_sym_rat(expr: Cons): expr is BCons<Sym, Sym, Rat> {
    if (is_mul_2_any_any(expr)) {
        const lhs = expr.item(1);
        const rhs = expr.item(2);
        return is_sym(lhs) && is_rat(rhs);
    }
    else {
        return false;
    }
}