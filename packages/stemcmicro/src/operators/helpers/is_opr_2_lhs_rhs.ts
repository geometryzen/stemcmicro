import { Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Cons, Cons2, U } from "math-expression-tree";
import { GUARD } from "./GUARD";
import { is_opr_2_any_any } from "./is_opr_2_any_any";

export function is_opr_2_lhs_rhs<L extends U, R extends U>(sym: Sym, guardL: GUARD<U, L>, guardR: GUARD<U, R>): (expr: Cons, $: ExprContext) => expr is Cons2<Sym, L, R> {
    return function (expr: Cons, $: ExprContext): expr is Cons2<Sym, L, R> {
        return is_opr_2_any_any(sym)(expr) && guardL(expr.lhs, $) && guardR(expr.rhs, $);
    };
}
