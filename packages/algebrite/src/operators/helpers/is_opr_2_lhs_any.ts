import { Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { is_opr_2_any_any } from "@stemcmicro/helpers";
import { Cons, Cons2, U } from "@stemcmicro/tree";
import { GUARD } from "./GUARD";

export function is_opr_2_lhs_any<L extends U>(sym: Sym, guardL: GUARD<U, L>): (expr: Cons, $: ExprContext) => expr is Cons2<Sym, L, U> {
    return function (expr: Cons, $: ExprContext): expr is Cons2<Sym, L, U> {
        return is_opr_2_any_any(sym)(expr) && guardL(expr.lhs, $);
    };
}
