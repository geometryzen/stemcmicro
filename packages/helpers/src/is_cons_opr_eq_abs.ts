import { Native, native_sym } from "@stemcmicro/native";
import { Cons } from "@stemcmicro/tree";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";

const ABS = native_sym(Native.abs);

export function is_cons_opr_eq_abs(expr: Cons): boolean {
    return is_cons_opr_eq_sym(expr, ABS);
}
