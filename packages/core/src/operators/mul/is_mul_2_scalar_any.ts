import { Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { Cons2, is_cons, U } from "@stemcmicro/tree";
import { isscalar } from "../../helpers/isscalar";

export function is_mul_2_scalar_any(expr: U, $: ExprContext): expr is Cons2<Sym, U, U> {
    return is_cons(expr) && is_mul_2_any_any(expr) && isscalar(expr.lhs, $);
}
