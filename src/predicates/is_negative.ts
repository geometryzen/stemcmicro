import { is_multiply } from "../runtime/helpers";
import { car, is_cons, U } from "../tree/tree";
import { is_negative_number } from "./is_negative_number";

/**
 * is_negative_number or (* lhs rhs) and is_negative_number(lhs)
 */
export function is_negative(expr: U): boolean {
    return is_negative_number(expr) || (is_cons(expr) && is_multiply(expr) && is_negative(car(expr.cdr)));
}
