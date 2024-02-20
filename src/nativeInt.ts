import { is_flt, is_rat, Num } from "math-expression-atoms";
import { U } from "math-expression-tree";
import { in_safe_integer_range } from "./in_safe_integer_range";
import { is_rat_and_integer } from "./is_rat_and_integer";

/**
 * If the expr is not a Rat or Flt then the result is NaN.
 * If the expr is a Rat and an integer and in safe range for JavaScript number then a number is returned.
 * If the expr is a Flt and an integer then the number is returned.
 */
export function nativeInt(expr: U): number {
    if (is_rat(expr)) {
        if (expr.isInteger() && in_safe_integer_range(expr.a)) {
            return expr.a.toJSNumber();
        }
        else {
            return NaN;
        }
    }
    else if (is_flt(expr)) {
        if (Math.floor(expr.d) === expr.d) {
            return expr.d;
        }
        else {
            return NaN;
        }
    }
    else {
        return NaN;
    }
}

export function is_integer_and_in_safe_number_range(num: Num): boolean {
    if (is_rat(num)) {
        if (is_rat_and_integer(num) && in_safe_integer_range(num.a)) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (is_flt(num)) {
        if (Math.floor(num.d) === num.d) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        throw new Error();
    }
}
