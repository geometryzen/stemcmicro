import { Native, native_sym } from "@stemcmicro/native";
import { Cons } from "@stemcmicro/tree";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";

const LCO = native_sym(Native.lco);

export function is_cons_opr_eq_lco(expr: Cons): boolean {
    return is_cons_opr_eq_sym(expr, LCO);
}
