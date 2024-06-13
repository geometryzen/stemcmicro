import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { Num } from "../../tree/num/Num";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_num } from "../num/is_num";

export function is_mul_2_num_any(expr: Cons): expr is Cons2<Sym, Num, U> {
    return is_mul_2_any_any(expr) && is_num(expr.lhs);
}
