import { Native, native_sym } from "@stemcmicro/native";
import { Cons } from "@stemcmicro/tree";
import { is_cons_opr_eq_sym } from "./is_cons_opr_eq_sym";

const INV = native_sym(Native.inv);

export function is_cons_opr_eq_inv(expr: Cons): boolean {
    return is_cons_opr_eq_sym(expr, INV);
}
