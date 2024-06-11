import { Sym } from "@stemcmicro/atoms";
import { Cons, Cons2, is_cons2, U } from "@stemcmicro/tree";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";

export function is_opr_2_any_any(name: Sym): (expr: Cons) => expr is Cons2<Sym, U, U> {
    return function (expr: Cons): expr is Cons2<Sym, U, U> {
        return is_cons_opr_eq_sym(expr, name) && is_cons2(expr);
    };
}
