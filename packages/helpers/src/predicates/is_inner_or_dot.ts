import { Native, native_sym } from "@stemcmicro/native";
import { is_cons, U } from "@stemcmicro/tree";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";

const MATH_INNER = native_sym(Native.inner);
const DOT = native_sym(Native.dot);

export function is_inner_or_dot(expr: U): boolean {
    if (is_cons(expr)) {
        if (is_cons_opr_eq_sym(expr, MATH_INNER)) {
            return true;
        }
        if (is_cons_opr_eq_sym(expr, DOT)) {
            return true;
        }
        return false;
    } else {
        return false;
    }
}
