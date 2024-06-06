import { Native, native_sym } from "@stemcmicro/native";
import { Cons } from "@stemcmicro/tree";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";

const POWER = native_sym(Native.pow);

export function is_cons_opr_eq_power(expr: Cons): boolean {
    return is_cons_opr_eq_sym(expr, POWER);
}
