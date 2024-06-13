import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_inner_2_sym_sym } from "../inner/is_inner_2_sym_sym";
import { is_sym } from "../sym/is_sym";

export function is_mul_2_inner_2_sym_sym_sym(expr: Cons): expr is Cons2<Sym, Cons2<Sym, Sym, Sym>, Sym> {
    return is_mul_2_any_any(expr) && is_cons(expr.lhs) && is_inner_2_sym_sym(expr.lhs) && is_sym(expr.rhs);
}
