import { Rat } from "@stemcmicro/atoms";
import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";

export function is_mul_2_sym_rat(expr: Cons): expr is Cons2<Sym, Sym, Rat> {
    if (is_mul_2_any_any(expr)) {
        const lhs = expr.item(1);
        const rhs = expr.item(2);
        return is_sym(lhs) && is_rat(rhs);
    } else {
        return false;
    }
}
