import { is_multiply } from "../runtime/helpers";
import { car, U } from "../tree/tree";
import { is_negative_number } from "./is_negative_number";

/**
 * is_negative_number or (* lhs rhs) and is_negative_number(lhs)
 */
export function is_negative(expr: U): boolean {
    if (is_negative_number(expr)) {
        return true;
    }
    else {
        if (is_multiply(expr)) {
            if (is_negative(car(expr.cdr))) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
}
