import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "./Cons2";
import { GUARD } from "./GUARD";
import { is_opr_2_any_any } from "./is_opr_2_any_any";

export function is_opr_2_lhs_rhs<L extends U, R extends U>(sym: Sym, guardL: GUARD<U, L>, guardR: GUARD<U, R>): (expr: Cons) => expr is Cons2<Sym, L, R> {
    return function (expr: Cons): expr is Cons2<Sym, L, R> {
        return is_opr_2_any_any(sym)(expr) && guardL(expr.lhs) && guardR(expr.rhs);
    };
}