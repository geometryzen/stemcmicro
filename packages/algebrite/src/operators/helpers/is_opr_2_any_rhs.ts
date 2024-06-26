import { Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { is_opr_2_any_any } from "@stemcmicro/helpers";
import { Cons, Cons2, U } from "@stemcmicro/tree";
import { GUARD } from "./GUARD";

export function is_opr_2_any_rhs<R extends U>(sym: Sym, guardR: GUARD<U, R>): (expr: Cons, $: ExprContext) => expr is Cons2<Sym, U, R> {
    return function (expr: Cons, $: ExprContext): expr is Cons2<Sym, U, R> {
        return is_opr_2_any_any(sym)(expr) && guardR(expr.rhs, $);
    };
}
