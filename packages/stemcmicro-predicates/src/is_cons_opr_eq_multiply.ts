import { Native, native_sym } from "@stemcmicro/native";
import { Cons } from "@stemcmicro/tree";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";

const MATH_MUL = native_sym(Native.multiply);

export function is_cons_opr_eq_multiply(expr: Cons): expr is Cons & { __ts_sym: "*" } {
    return is_cons_opr_eq_sym(expr, MATH_MUL);
}
