import { Sym } from "@stemcmicro/atoms";
import { is_cons_opr_eq_sym } from "@stemcmicro/predicates";
import { Cons, Cons1, U } from "@stemcmicro/tree";
import { is_unaop } from "./is_unaop";

export function is_opr_1_any(opr: Sym): (expr: Cons) => expr is Cons1<Sym, U> {
    return function (expr: Cons): expr is Cons1<Sym, U> {
        return is_cons_opr_eq_sym(expr, opr) && is_unaop(expr);
    };
}
