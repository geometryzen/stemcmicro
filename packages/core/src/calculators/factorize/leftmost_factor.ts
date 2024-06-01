import { is_mul_2_any_any } from "../../operators/mul/is_mul_2_any_any";
import { is_cons, U } from "../../tree/tree";

/**
 * WARNING: Only works when expr is binary multiplication.
 */
export function leftmost_factor(expr: U): U {
    if (is_cons(expr) && is_mul_2_any_any(expr)) {
        return leftmost_factor(expr.lhs);
    }
    return expr;
}
