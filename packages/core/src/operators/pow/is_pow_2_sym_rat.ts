import { Rat } from "@stemcmicro/atoms";
import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";
import { is_pow_2_any_any } from "./is_pow_2_any_any";

export function is_pow_2_sym_rat(expr: Cons): expr is Cons2<Sym, Sym, Rat> {
    return is_pow_2_any_any(expr) && is_sym(expr.lhs) && is_rat(expr.rhs);
}
