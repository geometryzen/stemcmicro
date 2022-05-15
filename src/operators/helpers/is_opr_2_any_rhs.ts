import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "./BCons";
import { GUARD } from "./GUARD";
import { is_opr_2_any_any } from "./is_opr_2_any_any";

export function is_opr_2_any_rhs<R extends U>(sym: Sym, guardR: GUARD<U, R>): (expr: Cons) => expr is BCons<Sym, U, R> {
    return function (expr: Cons): expr is BCons<Sym, U, R> {
        return is_opr_2_any_any(sym)(expr) && guardR(expr.rhs);
    };
}