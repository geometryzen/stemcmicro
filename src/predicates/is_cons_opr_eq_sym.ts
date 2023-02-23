import { is_sym } from "../operators/sym/is_sym";
import { Sym } from "../tree/sym/Sym";
import { Cons } from "../tree/tree";

export function is_cons_opr_eq_sym(expr: Cons, name: Sym): boolean {
    const opr = expr.car;
    if (is_sym(opr)) {
        return opr.equalsSym(name);
    }
    else {
        return false;
    }
}