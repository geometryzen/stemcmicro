import { Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { is_opr_2_any_any } from "@stemcmicro/helpers";
import { Cons, Cons2, U } from "@stemcmicro/tree";
import { GUARD } from "./GUARD";

export function is_opr_2_lhs_rhs<L extends U, R extends U>(sym: Sym, guardL: GUARD<U, L>, guardR: GUARD<U, R>): (expr: Cons, $: ExprContext) => expr is Cons2<Sym, L, R> {
    return function (expr: Cons, $: ExprContext): expr is Cons2<Sym, L, R> {
        return is_opr_2_any_any(sym)(expr) && guardL(expr.lhs, $) && guardR(expr.rhs, $);
    };
}
