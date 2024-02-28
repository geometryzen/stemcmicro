import { Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Cons2, is_cons, U } from "math-expression-tree";
import { isscalar } from "../../helpers/isscalar";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_scalar_any(expr: U, $: ExprContext): expr is Cons2<Sym, U, U> {
    return is_cons(expr) && is_mul_2_any_any(expr) && isscalar(expr.lhs, $);
}