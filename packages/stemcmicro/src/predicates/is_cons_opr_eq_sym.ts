import { is_sym, Sym } from "@stemcmicro/atoms";
import { Cons, Cons0 } from "@stemcmicro/tree";

export function is_cons_opr_eq_sym(expr: Cons, name: Sym): expr is Cons0<Sym> {
    const opr = expr.car;
    if (is_sym(opr)) {
        return opr.equalsSym(name);
    } else {
        return false;
    }
}
