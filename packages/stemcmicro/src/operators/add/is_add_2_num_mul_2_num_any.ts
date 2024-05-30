import { is_num } from "../num/is_num";
import { Num } from "../../tree/num/Num";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_mul_2_num_any } from "../mul/is_mul_2_num_any";
import { is_add_2_any_any } from "./is_add_2_any_any";

export function is_add_2_num_mul_2_num_any(expr: Cons): expr is Cons2<Sym, Num, Cons2<Sym, Num, U>> {
    if (is_add_2_any_any(expr)) {
        const lhs = expr.lhs;
        const rhs = expr.rhs;
        return is_num(lhs) && is_cons(rhs) && is_mul_2_num_any(rhs);
    } else {
        return false;
    }
}
