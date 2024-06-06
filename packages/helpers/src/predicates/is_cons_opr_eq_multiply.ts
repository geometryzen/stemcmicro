import { Native, native_sym } from "@stemcmicro/native";
import { Cons } from "@stemcmicro/tree";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";

const MULTIPLY = native_sym(Native.multiply);

export function is_cons_opr_eq_multiply(expr: Cons): boolean {
    return is_cons_opr_eq_sym(expr, MULTIPLY);
}
