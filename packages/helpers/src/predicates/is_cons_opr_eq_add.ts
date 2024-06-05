import { Native, native_sym } from "@stemcmicro/native";
import { Cons } from "@stemcmicro/tree";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";

const MATH_ADD = native_sym(Native.add);

export function is_cons_opr_eq_add(expr: Cons): expr is Cons & { __ts_sym: "+" } {
    return is_cons_opr_eq_sym(expr, MATH_ADD);
}
