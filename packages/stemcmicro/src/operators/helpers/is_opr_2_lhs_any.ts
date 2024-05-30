import { Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Cons, Cons2, U } from "math-expression-tree";
import { GUARD } from "./GUARD";
import { is_opr_2_any_any } from "./is_opr_2_any_any";

export function is_opr_2_lhs_any<L extends U>(sym: Sym, guardL: GUARD<U, L>): (expr: Cons, $: ExprContext) => expr is Cons2<Sym, L, U> {
    return function (expr: Cons, $: ExprContext): expr is Cons2<Sym, L, U> {
        return is_opr_2_any_any(sym)(expr) && guardL(expr.lhs, $);
    };
}
