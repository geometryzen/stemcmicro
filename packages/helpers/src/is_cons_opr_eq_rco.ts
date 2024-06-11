import { Native, native_sym } from "@stemcmicro/native";
import { Cons } from "@stemcmicro/tree";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";

const RCO = native_sym(Native.rco);

export function is_cons_opr_eq_rco(expr: Cons): boolean {
    return is_cons_opr_eq_sym(expr, RCO);
}
