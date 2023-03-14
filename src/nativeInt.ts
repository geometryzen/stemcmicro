import { in_safe_integer_range } from "./in_safe_integer_range";
import { is_rat_and_integer } from "./is_rat_and_integer";
import { is_flt } from "./operators/flt/is_flt";
import { is_rat } from "./operators/rat/is_rat";
import { U } from "./tree/tree";

export function nativeInt(expr: U): number {
    if (is_rat(expr)) {
        if (is_rat_and_integer(expr) && in_safe_integer_range(expr.a)) {
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
