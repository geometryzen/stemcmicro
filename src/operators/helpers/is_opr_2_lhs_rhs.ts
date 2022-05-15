import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "./BCons";
import { GUARD } from "./GUARD";
import { is_opr_2_any_any } from "./is_opr_2_any_any";

export function is_opr_2_lhs_rhs<L extends U, R extends U>(sym: Sym, guardL: GUARD<U, L>, guardR: GUARD<U, R>): (expr: Cons) => expr is BCons<Sym, L, R> {
    return function (expr: Cons): expr is BCons<Sym, L, R> {
        return is_opr_2_any_any(sym)(expr) && guardL(expr.lhs) && guardR(expr.rhs);
    };
}