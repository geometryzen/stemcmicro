import { Rat } from "@stemcmicro/atoms";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_any } from "../helpers/is_any";
import { is_mul_2_rat_sym } from "../mul/is_mul_2_rat_sym";
import { is_add_2_any_any } from "./is_add_2_any_any";

type LHS = U;
type RHS = Cons2<Sym, Rat, Sym>;
type EXPR = Cons2<Sym, LHS, RHS>;

export function is_add_2_any_mul_2_rat_sym(expr: Cons): expr is EXPR {
    if (is_add_2_any_any(expr)) {
        const lhs = expr.lhs;
        const rhs = expr.rhs;
        return is_any(lhs) && is_cons(rhs) && is_mul_2_rat_sym(rhs);
    } else {
        return false;
    }
}
