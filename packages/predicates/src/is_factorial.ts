import { Native, native_sym } from "@stemcmicro/native";
import { Cons, is_cons, U } from "@stemcmicro/tree";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";

const MATH_FACTORIAL = native_sym(Native.factorial);

export function is_factorial(expr: U): expr is Cons & { __ts_sym: "MATH_FACTORIAL" } {
    return is_cons(expr) && is_cons_opr_eq_sym(expr, MATH_FACTORIAL);
}
